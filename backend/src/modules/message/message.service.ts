import prisma from "@/lib/prisma";
import * as messageRepo from "./message.repository";
import { ApiError } from "@/utils/Error";
import { getFileUrl } from "../storage/storage.service";
import { createMessageValidation } from "./message.validation";
import { PrismaClient } from "@prisma/client/extension";
import { MessageStatus, Prisma } from "@prisma/client";
import { MessageReceipt } from "./message.types";

interface GetMessagesParams {
  userId: string;
  roomId: string;
  cursor?: string; // messageId
  limit?: number;
}

const MESSAGE_STATUS_PRIORITY: Record<MessageStatus, number> = {
  READ: 3,
  DELIVERED: 2,
  SENT: 1,
};

const getMessageStatus = (
  receipts: { status: MessageStatus }[],
): MessageStatus | null => {
  if (receipts.length === 0) return null;

  return receipts.reduce<MessageStatus>((lowestStatus, receipt) => {
    return MESSAGE_STATUS_PRIORITY[receipt.status] <
      MESSAGE_STATUS_PRIORITY[lowestStatus]
      ? receipt.status
      : lowestStatus;
  }, "READ");
};

const getMessagesService = async ({
  userId,
  roomId,
  cursor,
  limit = 20,
}: GetMessagesParams) => {
  const roomMember = await prisma.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
  });

  if (!roomMember) {
    throw new ApiError("User is not in room.");
  }

  const messages = await prisma.message.findMany({
    where: {
      roomId,
      deletedAt: null,
    },

    take: limit + 1, // check if next page exists

    ...(cursor && {
      cursor: { id: cursor },
      skip: 1, // skip cursor itself
    }),

    orderBy: [{ createdAt: "desc" }, { id: "desc" }],

    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarId: true,
        },
      },
      attachments: {
        select: {
          id: true,
          key: true,
          filename: true,
          mimetype: true,
          size: true,
          kind: true,
        },
      },
      messageReactions: true,
      messageReceipts: {
        select: {
          status: true,
        },
      },
    },
  });

  let nextCursor: string | null = null;

  if (messages.length > limit) {
    const nextItem = messages.pop(); // remove extra
    nextCursor = nextItem!.id;
  }

  const formatted = await Promise.all(
    messages.map(async (msg) => ({
      id: msg.id,
      sender: {
        id: msg?.sender.id,
        name: `${msg?.sender.firstName} ${msg?.sender.lastName}`,
        avatar: msg?.sender.avatarId
          ? await getFileUrl(msg.sender.avatarId)
          : null,
      },
      content: msg.content,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      isEdited: msg.isEdited,
      parentId: msg.parentId,
      attachments: await Promise.all(
        (msg.attachments || []).map(async (a) => ({
          ...a,
          url: await getFileUrl(a.id),
        })),
      ),
      reactions: msg.messageReactions,
      status: getMessageStatus(msg.messageReceipts),
      isOwn: msg.senderId === userId,
    })),
  );

  return {
    data: formatted,
    nextCursor,
    hasMore: !!nextCursor,
  };
};

interface CreateMessageParams {
  tempId?: string; // For optimistic UI, not stored in DB
  roomId: string;
  senderId: string;
  content: string;
  parentId?: string;
  attachmentIds?: string[];
}

const createMessageService = async ({
  tempId,
  roomId,
  senderId,
  content,
  parentId,
  attachmentIds = [],
}: CreateMessageParams) => {
  const parsed = createMessageValidation.parse({
    tempId,
    roomId,
    senderId,
    content,
    parentId,
    attachmentIds,
  });

  const message = await prisma.$transaction(async (tx) => {
    // 1. Validate user is in room
    const member = await tx.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: parsed.senderId,
          roomId: parsed.roomId,
        },
      },
    });

    if (!member) {
      throw new Error("User not in room");
    }

    // 2. Create message
    const message = await tx.message.create({
      data: {
        roomId: parsed.roomId,
        senderId: parsed.senderId,
        content: parsed.content,
        parentId: parsed.parentId || null,
      },

      select: { id: true },
    });

    // attach attachments to the message
    await tx.file.updateMany({
      where: { id: { in: attachmentIds }, status: "PENDING", userId: senderId },
      data: { status: "ATTACHED", messageId: message.id },
    });

    // create message recipts for room members
    const roomMembers = await tx.roomMember.findMany({
      where: { roomId: parsed.roomId },
      select: { userId: true },
    });

    await tx.messageReceipt.createMany({
      data: roomMembers.map((m) => ({
        messageId: message.id,
        userId: m.userId,
        status: m.userId === parsed.senderId ? "READ" : "DELIVERED",
      })),
    });

    const freshMessage = await tx.message.findUnique({
      where: { id: message.id },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarId: true,
          },
        },
        attachments: {
          select: {
            id: true,
            key: true,
            filename: true,
            mimetype: true,
            size: true,
            kind: true,
          },
        },
        messageReactions: true,
        messageReceipts: {
          select: {
            status: true,
          },
        },
      },
    });

    console.log("found message", freshMessage);

    const formattedAttachments = await Promise.all(
      (freshMessage?.attachments || [])?.map(async (a) => {
        const url = await getFileUrl(a.id);
        return {
          ...a,
          url,
        };
      }),
    );

    const formattedMessage = {
      id: freshMessage?.id,
      sender: {
        id: freshMessage?.sender.id,
        name: `${freshMessage?.sender.firstName} ${freshMessage?.sender.lastName}`,
        avatar: freshMessage?.sender?.avatarId
          ? await getFileUrl(freshMessage.sender.avatarId)
          : null,
      },
      content: freshMessage?.content,
      createdAt: freshMessage?.createdAt,
      updatedAt: freshMessage?.updatedAt,
      isEdited: freshMessage?.isEdited,
      parentId: freshMessage?.parentId,
      attachments: formattedAttachments,
      reactions: freshMessage?.messageReactions,
      status: getMessageStatus(freshMessage?.messageReceipts || []),
    };

    return formattedMessage;
  });

  return { ...message, tempId };
};

export { getMessagesService, createMessageService };

import prisma from "@/lib/prisma";
import * as messageRepo from "./message.repository";
import { ApiError } from "@/utils/Error";
import { getFileUrl } from "../storage/storage.service";
import { createMessageValidation } from "./message.validation";

interface GetMessagesParams {
  userId: string;
  roomId: string;
  cursor?: string; // messageId
  limit?: number;
}

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
      attachments: true,
      messageReactions: true,
      messageReceipts: true,
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
      attachments: msg.attachments,
      reactions: msg.messageReactions,
      receipts: msg.messageReceipts,
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

        attachments: {
          connect: parsed?.attachmentIds?.map((id) => ({ id })),
        },
      },

      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarId: true,
          },
        },
        attachments: true,
        messageReactions: true,
        messageReceipts: true,
      },
    });

    // 3. Create receipts (DELIVERED)
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

    const formattedMessage = {
      id: message.id,
      sender: {
        id: message?.sender.id,
        name: `${message?.sender.firstName} ${message?.sender.lastName}`,
        avatar: message.sender?.avatarId
          ? await getFileUrl(message.sender.avatarId)
          : null,
      },
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isEdited: message.isEdited,
      parentId: message.parentId,
      attachments: message.attachments,
      reactions: message.messageReactions,
      receipts: message.messageReceipts,
    };

    return formattedMessage;
  });

  return { ...message, tempId };
};

export { getMessagesService, createMessageService };

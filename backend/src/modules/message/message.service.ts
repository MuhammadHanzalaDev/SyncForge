import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/Error";
import { getFileUrl } from "../storage/storage.service";
import {
  createMessageValidation,
  messageReactionValidation,
} from "./message.validation";
import { MessageStatus } from "@prisma/client";
import { emitMessageReceived } from "./message.events";
import { format, parse } from "node:path";

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
): MessageStatus => {
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
      parent: {
        select: {
          id: true,
          content: true,
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
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
      ...(msg.parent
        ? {
            parent: {
              ...msg.parent,
              sender: {
                id: msg.parent.sender.id,
                name: `${msg.parent.sender.firstName} ${msg.parent.sender.lastName}`,
              },
            },
          }
        : {}),
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

  const data = await prisma.$transaction(async (tx) => {
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
      throw new ApiError("User not in room", 400);
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
    const result = await tx.file.updateMany({
      where: {
        id: { in: attachmentIds },
        status: "PENDING",
        userId: parsed.senderId,
      },
      data: { status: "ATTACHED", messageId: message.id },
    });

    if (result.count !== parsed.attachmentIds?.length) {
      throw new ApiError("Invalid or already-used attachments", 400);
    }

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
            durationSec: true,
          },
        },
        messageReactions: true,
        messageReceipts: {
          select: {
            status: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!freshMessage) {
      throw new ApiError("Message creation error!", 500);
    }

    return { message: freshMessage, roomMembers };
  });

  const message = data.message;
  const roomMembers = data.roomMembers;

  // format Message
  const formattedAttachments = await Promise.all(
    (message.attachments || [])?.map(async (a) => {
      const url = await getFileUrl(a.id);
      return {
        ...a,
        url,
      };
    }),
  );

  const formattedMessage = {
    id: message.id,
    sender: {
      id: message.sender.id,
      name: `${message.sender.firstName} ${message.sender.lastName}`,
      avatar: message.sender.avatarId
        ? await getFileUrl(message.sender.avatarId)
        : null,
    },
    content: message.content,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    isEdited: message.isEdited,
    parentId: message?.parentId,
    ...(message.parent
      ? {
          parent: {
            ...message.parent,
            sender: {
              id: message.parent.sender.id,
              name: `${message.parent.sender.firstName} ${message.parent.sender.lastName}`,
            },
          },
        }
      : {}),
    attachments: formattedAttachments,
    reactions: message.messageReactions,
    status: getMessageStatus(message.messageReceipts || []),
  };

  // emit message received
  try {
    emitMessageReceived(
      { ...formattedMessage, tempId },
      roomMembers?.map((m) => m.userId),
      roomId,
    );
  } catch (error) {
    console.log("message emit failed", error);
  }
};

const readMessageService = async ({
  messageId,
  userId,
  roomId,
}: {
  messageId: string;
  userId: string;
  roomId: string;
}) => {
  // Update the receipt status to READ
  const allReceipts = await prisma.$transaction(async (tx) => {
    await tx.messageReceipt.update({
      where: {
        messageId_userId: { messageId, userId },
        NOT: { status: "READ" },
      },
      data: { status: "READ" },
    });

    await tx.roomMember.update({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      data: { lastReadAt: new Date() },
    });

    return tx.messageReceipt.findMany({
      where: { messageId },
      select: { status: true, userId: true },
    });
  });

  const newStatus = getMessageStatus(allReceipts);

  const data = { messageId, status: newStatus, roomId };
  const roomMembers = allReceipts?.map((r) => r.userId);

  return { data, roomMembers };
};

const messageReactionService = async ({
  messageId,
  userId,
  roomId,
  emoji,
}: {
  messageId: string;
  userId: string;
  roomId: string;
  emoji: string;
}) => {
  const validated = messageReactionValidation.parse({
    messageId,
    userId,
    roomId,
    emoji,
  });

  const existingReaction = await prisma.messageReaction.findUnique({
    where: {
      messageId_userId: {
        messageId: validated.messageId,
        userId: validated.userId,
      },
    },
  });

  let action: "added" | "removed" | "updated";

  if (!existingReaction) {
    await prisma.messageReaction.create({
      data: {
        messageId: validated.messageId,
        userId: validated.userId,
        emoji: validated.emoji,
      },
    });

    action = "added";
  } else if (existingReaction.emoji === validated.emoji) {
    await prisma.messageReaction.delete({
      where: {
        messageId_userId: {
          messageId: validated.messageId,
          userId: validated.userId,
        },
      },
    });

    action = "removed";
  } else {
    await prisma.messageReaction.update({
      where: {
        messageId_userId: {
          messageId: validated.messageId,
          userId: validated.userId,
        },
      },
      data: {
        emoji: validated.emoji,
      },
    });

    action = "updated";
  }

  const allMembers = await prisma.roomMember.findMany({
    where: { roomId },
    select: { userId: true },
  });

  const data = {
    action,
    messageId: validated.messageId,
    userId: validated.userId,
    roomId: validated.roomId,
    emoji: validated.emoji,
  };

  return { data, memberIds: allMembers.map((m) => m.userId) };
};

export {
  getMessagesService,
  createMessageService,
  readMessageService,
  messageReactionService,
};

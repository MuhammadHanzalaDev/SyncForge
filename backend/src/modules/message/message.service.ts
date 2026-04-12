import prisma from "@/lib/prisma";
import * as messageRepo from "./message.repository";
import { ApiError } from "@/utils/Error";

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

  const messages = await messageRepo.findMany({
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

  return {
    data: messages,
    nextCursor,
  };
};

interface CreateMessageParams {
  roomId: string;
  senderId: string;
  content: string;
  parentId?: string;
  attachmentIds?: string[];
}

const createMessageService = async ({
  roomId,
  senderId,
  content,
  parentId,
  attachmentIds = [],
}: CreateMessageParams) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Validate user is in room
    const member = await tx.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: senderId,
          roomId,
        },
      },
    });

    if (!member) {
      throw new Error("User not in room");
    }

    // 2. Create message
    const message = await tx.message.create({
      data: {
        roomId,
        senderId,
        content,
        parentId: parentId || null,

        attachments: {
          connect: attachmentIds.map((id) => ({ id })),
        },
      },

      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        attachments: true,
      },
    });

    // 3. Create receipts (DELIVERED)
    const roomMembers = await tx.roomMember.findMany({
      where: { roomId },
      select: { userId: true },
    });

    await tx.messageReceipt.createMany({
      data: roomMembers.map((m) => ({
        messageId: message.id,
        userId: m.userId,
        status: m.userId === senderId ? "READ" : "DELIVERED",
      })),
    });

    return message;
  });
};

export { getMessagesService, createMessageService };

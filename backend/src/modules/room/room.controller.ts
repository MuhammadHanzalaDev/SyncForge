import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "@/lib/prisma";
import type { getRoomsRequest } from "./room.types";
import { getFileUrl } from "../storage/storage.service";

const getRooms = async (
  request: FastifyRequest<getRoomsRequest>,
  reply: FastifyReply,
) => {
  const userId = request.user.userId;
  const workspaceId = request.params.workspaceId;

  const workspaceMembers = await prisma.workspaceMember.findMany({
    where: {
      workspaceId,
      NOT: {
        userId: userId,
      },
    },
    select: {
      status: true,
      lastSeenAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarId: true,
        },
      },
    },
  });

  const directChatCandidates = await Promise.all(
    workspaceMembers.map(async (member) => ({
      id: member.user.id,
      name: `${member.user?.firstName} ${member.user?.lastName}`,
      email: member.user?.email,
      avatar: member.user?.avatarId
        ? await getFileUrl(member.user.avatarId)
        : null,
      type: "DIRECT",
      status: member.status,
      lastSeenAt: member.lastSeenAt,
    })),
  );

  const rooms = await prisma.room.findMany({
    where: {
      workspaceId,
      NOT: {
        type: "DIRECT",
      },
    },
    include: {
      roomMembers: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // last message only
      },
    },
    // orderBy: {
    //   updatedAt: "desc", // optional if you add it
    // },
  });

  const formattedRooms = rooms.map((room) => ({
    id: room.id,
    name: room.name,
    type: room.type,
    members: room.roomMembers.map((rm) => rm.user),
    lastMessage: room.messages[0] || null,
  }));

  return { data: { rooms: formattedRooms, chats: directChatCandidates } };
};

export { getRooms };

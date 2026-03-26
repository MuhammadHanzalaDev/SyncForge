import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/config/prisma";
import {
  createWorkspaceService,
  joinWorkspaceService,
} from "./workspace.service";
import { parseMultipart } from "@/utils/multipart";
import { findManyWorkspaces } from "./workspace.repository";
import { getFileUrl } from "../storage/storage.service";
import { env } from "@/config/env";
import { getChatsAndRoomsRequest } from "./workspace.types";

const getAllWorkspaces = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user.userId;

  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  console.log(workspaces);

  const formatted = await Promise.all(
    workspaces.map(async (w) => {
      const fileUrl = w.avatarId ? await getFileUrl(w.avatarId) : null;

      return {
        id: w.id,
        name: w.name,
        createdAt: w.createdAt,
        logo: fileUrl,
        fileId: w.avatarId,
        totalMembers: w._count?.members,
      };
    }),
  );

  return { data: formatted };
};

const createWorkspace = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  const data = await parseMultipart(request);
  console.log(data);

  const workspace = await createWorkspaceService(userId, data);

  return { data: workspace };
};

const joinWorkspace = async (
  request: FastifyRequest<{ Querystring: { token: string } }>,
  reply: FastifyReply,
) => {
  const token = request.query.token;

  await joinWorkspaceService(token, reply);

  reply.redirect(env.CLIENT_URL);
};

const getChatsAndRooms = async (
  request: FastifyRequest<getChatsAndRoomsRequest>,
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
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true, // optional
        },
      },
    },
  });

  const directChatCandidates = workspaceMembers.map((member) => ({
    id: member.user.id,
    name: `${member.user.firstName} ${member.user.lastName}`,
    email: member.user.email,
    avatar: member.user.avatar ? getFileUrl(member.user.avatar.id) : null,
    type: "DIRECT",
  }));

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

export { getAllWorkspaces, createWorkspace, joinWorkspace, getChatsAndRooms };

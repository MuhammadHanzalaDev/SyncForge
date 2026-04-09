import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/lib/prisma";
import {
  createWorkspaceService,
  joinWorkspaceService,
} from "./workspace.service";
import { parseMultipart } from "@/utils/multipart";
import { getFileUrl } from "../storage/storage.service";
import { env } from "@/config/env";

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

export { getAllWorkspaces, createWorkspace, joinWorkspace };

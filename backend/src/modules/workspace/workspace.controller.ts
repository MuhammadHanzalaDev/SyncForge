import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/config/prisma";
import { createWorkspaceService } from "./workspace.service";

const getAllWorkspaces = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user.userId;

  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId: userId,
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

  return { data: workspaces };
};

const createWorkspace = async (
  request: FastifyRequest<{ Body: { name: string; emails: [string] } }>,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const data = request.body;
  const file = request.file;

  const workspace = await createWorkspaceService(userId, data, file);

  return { data: workspace };
};

export { getAllWorkspaces, createWorkspace };

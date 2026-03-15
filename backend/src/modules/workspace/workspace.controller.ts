import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/config/prisma";
import { createWorkspaceService } from "./workspace.service";
import { parseMultipart } from "@/utils/multipart";

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

  return { data: [] };
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

export { getAllWorkspaces, createWorkspace };

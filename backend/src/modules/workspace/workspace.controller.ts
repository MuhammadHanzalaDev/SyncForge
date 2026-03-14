import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/config/prisma";

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
  request: FastifyRequest<{ Body: { name: string; emails?: [string] } }>,
  reply: FastifyReply,
) => {
  const userId = request.user.userId;
  const { name, emails } = request.body;

  const workspace = await prisma.workspace.create({
    data: {
      name,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  return { data: workspace };
};

export { getAllWorkspaces, createWorkspace };

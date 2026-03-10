import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/config/prisma";

const getAllWorkspaces = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const useId = request.user.userId;

  const workspaces = await prisma.workspace.findMany({
    where: { ownerId: useId },
  });

  return { data: workspaces };
};

export { getAllWorkspaces };

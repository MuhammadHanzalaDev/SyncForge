import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/config/prisma";
import { createWorkspaceService } from "./workspace.service";
import { parseMultipart } from "@/utils/multipart";
import { findManyWorkspaces } from "./workspace.repository";
import { getFileUrl } from "../storage/storage.service";

const getAllWorkspaces = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user.userId;

  const workspaces = await findManyWorkspaces(
    {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    {
      _count: {
        select: {
          members: true,
        },
      },
    },
  );

  const formatted = await Promise.all(
    workspaces.map(async (w) => {
      const fileUrl = w.avatarId ? await getFileUrl(w.avatarId) : null;

      return {
        id: w.id,
        name: w.name,
        createdAt: w.createdAt,
        logo: fileUrl,
        // totalMembers: w._count?.members
      }
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

export { getAllWorkspaces, createWorkspace };

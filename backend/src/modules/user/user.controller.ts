import prisma from "@/config/prisma";
import { ApiError } from "@/utils/Error";
import { FastifyRequest, FastifyReply } from "fastify";
import { getFileUrl } from "../storage/storage.service";

const getPersonalInfo = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarId: true,
      isVerified: true,
    },
  });

  if (!user) throw new ApiError("User not found!", 404);

  const formatted = {
    ...user,
    avatar: user.avatarId ? getFileUrl(user.avatarId) : null,
  };

  return { data: formatted };
};

export { getPersonalInfo };

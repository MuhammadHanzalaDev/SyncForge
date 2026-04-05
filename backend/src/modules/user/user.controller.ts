import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/Error";
import { FastifyRequest, FastifyReply } from "fastify";
import { getFileUrl } from "../storage/storage.service";
import { parseMultipart } from "@/utils/multipart";
import { updatePersonalInfoService } from "./user.service";
import { findUserById } from "../auth/auth.repository";

const getPersonalInfo = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user.userId;

  const user = await findUserById(userId, {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    avatarId: true,
    isVerified: true,
  });

  if (!user) throw new ApiError("User not found!", 404);

  const formatted = {
    ...user,
    avatar: user.avatarId ? await getFileUrl(user.avatarId) : null,
  };

  return { data: formatted };
};

const updateProfileInfo = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  const data = await parseMultipart(request);

  await updatePersonalInfoService(userId, data);

  return { message: "data updated successfully!" };
};

export { getPersonalInfo, updateProfileInfo };

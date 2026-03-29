import prisma from "@/config/prisma";
import { ApiError } from "@/utils/Error";
import { FastifyRequest, FastifyReply } from "fastify";
import { getFileUrl } from "../storage/storage.service";
import { parseMultipart } from "@/utils/multipart";
import { updatePersonalInfoService } from "./user.service";

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

  console.log("user", user);
  if (!user) throw new ApiError("User not found!", 404);

  const formatted = {
    ...user,
    avatar: user.avatarId ? await getFileUrl(user.avatarId) : null,
  };
  console.log("formatted", formatted);

  return { data: formatted };
};

const updateProfileInfo = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  console.log(request.user);
  const userId = request.user?.userId;

  const data = await parseMultipart(request);
  console.log(data);

  await updatePersonalInfoService(userId, data);

  return { message: "data updated successfully!" };
};

export { getPersonalInfo, updateProfileInfo };

import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type SignUpRequest = FastifyRequest<{
  Body: Prisma.UserCreateInput;
}>;

const signUp = async (request: SignUpRequest, reply: FastifyReply) => {
  const data = request.body;

  const user = prisma.user.create({
    data,
  });

  console.log("user", user);

  return { user, message: "User Created Successfully!" };
};

export { signUp };

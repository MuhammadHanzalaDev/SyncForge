import prisma from "@/config/prisma";
import { RegisterValues } from "./auth.types";

const addUser = (data: RegisterValues) => {
  return prisma.user.create({
    data: data,
  });
};

const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email: email },
  });
};

const findUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const updateUserByEmail = (email: string, data: any) => {
  return prisma.user.update({
    where: { email: email },
    data: data,
  });
};

export { addUser, findUserByEmail, findUserById, updateUserByEmail };

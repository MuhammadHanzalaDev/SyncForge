import prisma from "@/config/prisma";
import { RegisterValues, OtpValues } from "./auth.types";

// User
const createUser = (data: RegisterValues) => {
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

const updateUserById = (id: string, data: any) => {
  return prisma.user.update({
    where: { id },
    data: data,
  });
};

// Otp
const createOtp = (data: OtpValues) => {
  return prisma.otp.create({
    data: data,
  });
};

const findLatestOtp = (userId: string) => {
  return prisma.otp.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const deleteOtp = (id: string) => {
  return prisma.otp.delete({ where: { id } });
};

export {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserByEmail,
  updateUserById,
  createOtp,
  findLatestOtp,
  deleteOtp,
};

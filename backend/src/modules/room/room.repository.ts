import prisma from "@/lib/prisma";

const findRoom = (where: any) => {
  return prisma.room.findUnique({ where });
};

const createRoom = (data: any) => {
  return prisma.room.create({ data });
};

export { findRoom, createRoom };

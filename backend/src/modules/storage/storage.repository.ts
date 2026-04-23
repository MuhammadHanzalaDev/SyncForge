import prisma from "@/lib/prisma";
import z from "zod";

const createFile = (file: any) => {
  return prisma.file.create({
    data: file,
  });
};

const findFileById = (id: string) => {
  return prisma.file.findUnique({
    where: { id },
  });
};

export { findFileById, createFile };

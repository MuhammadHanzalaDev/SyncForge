import prisma from "@/lib/prisma";
import z from "zod";
import { CreateFileType } from "./storage.types";

const createFile = (file: CreateFileType) => {
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

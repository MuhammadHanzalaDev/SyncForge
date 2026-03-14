import prisma from "@/config/prisma";

const findFileById = (id: string) => {
  return prisma.file.findUnique({
    where: { id },
  });
};

export { findFileById };

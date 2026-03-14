import prisma from "@/config/prisma";
import { CreateWorkSpaceValues } from "./workspace.types";

const createWorkspace = (data: any) => {
  return prisma.workspace.create({
    data: data,
  });
};

export { createWorkspace };

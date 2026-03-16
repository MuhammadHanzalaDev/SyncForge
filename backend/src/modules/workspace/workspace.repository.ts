import prisma from "@/config/prisma";
import { CreateWorkSpaceValues } from "./workspace.types";

const findManyWorkspaces = (where: any, include?: any) => {
  return prisma.workspace.findMany({
    where,
    include,
  });
};

const createWorkspace = (data: any) => {
  return prisma.workspace.create({
    data: data,
  });
};

export { createWorkspace, findManyWorkspaces };

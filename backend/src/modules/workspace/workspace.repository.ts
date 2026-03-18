import prisma from "@/config/prisma";

const createWorkspace = (data: any) => {
  return prisma.workspace.create({
    data: data,
  });
};

const createWorkspaceMember = (data: any) => {
  return prisma.workspaceMember.create({
    data: data,
  });
};

const findManyWorkspaces = (where: any, include?: any) => {
  return prisma.workspace.findMany({
    where,
    include,
  });
};

const findWorkspaceMember = (where: any) => {
  return prisma.workspaceMember.findUnique({ where });
};

export {
  createWorkspace,
  createWorkspaceMember,
  findManyWorkspaces,
  findWorkspaceMember,
};

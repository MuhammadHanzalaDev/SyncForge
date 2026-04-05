import prisma from "@/lib/prisma";

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

const updateWorkspaceMember = (where: any, data: any) => {
  return prisma.workspaceMember.update({ where, data });
};

export {
  createWorkspace,
  createWorkspaceMember,
  findManyWorkspaces,
  findWorkspaceMember,
  updateWorkspaceMember,
};

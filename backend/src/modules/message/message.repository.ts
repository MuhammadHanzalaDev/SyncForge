import prisma from "@/lib/prisma";

const findMany = (query: any) => {
    return prisma.message.findMany(query);
}

export { findMany }
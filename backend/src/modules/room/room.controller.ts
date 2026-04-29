import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "@/lib/prisma";
import type { getRoomsRequest } from "./room.types";
import { getFileUrl } from "../storage/storage.service";

const getRooms = async (
  request: FastifyRequest<getRoomsRequest>,
  reply: FastifyReply,
) => {
  const userId = request.user.userId;
  const workspaceId = request.params.workspaceId;

  // 1. Fetch workspace members and rooms in parallel
  const [workspaceMembers, userRooms] = await Promise.all([
    prisma.workspaceMember.findMany({
      where: { workspaceId, NOT: { userId } },
      select: {
        status: true,
        lastSeenAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarId: true,
          },
        },
      },
    }),
    prisma.room.findMany({
      where: { workspaceId, roomMembers: { some: { userId } } },
      include: {
        roomMembers: {
          select: {
            userId: true,
            lastReadAt: true,
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
  ]);

  // 2. Helper: current user's lastReadAt for a room
  const lastReadIn = (room: (typeof userRooms)[number]) =>
    room.roomMembers.find((rm) => rm.userId === userId)?.lastReadAt;

  // 3. Compute hasUnread per room — one query, returns roomIds that have unread messages
  const roomsWithUnread = await prisma.message.findMany({
    where: {
      senderId: { not: userId },
      deletedAt: null,
      OR: userRooms.map((r) => ({
        roomId: r.id,
        createdAt: { gt: lastReadIn(r) ?? new Date(0) },
      })),
    },
    select: { roomId: true },
    distinct: ["roomId"],
  });

  const hasUnreadByRoomId = new Set(roomsWithUnread.map((m) => m.roomId));

  // 4. otherUserId → directRoomId lookup
  const directRoomByUserId = new Map<string, string>();
  for (const room of userRooms) {
    if (room.type !== "DIRECT") continue;
    const other = room.roomMembers.find((rm) => rm.userId !== userId);
    if (other) directRoomByUserId.set(other.userId, room.id);
  }

  // 5. Format chats (workspace members)
  const chats = await Promise.all(
    workspaceMembers.map(async (m) => {
      const directRoomId = directRoomByUserId.get(m.user.id);
      return {
        id: m.user.id,
        name: `${m.user.firstName} ${m.user.lastName}`,
        email: m.user.email,
        avatar: m.user.avatarId ? await getFileUrl(m.user.avatarId) : null,
        type: "DIRECT",
        status: m.status,
        hasUnread: directRoomId ? hasUnreadByRoomId.has(directRoomId) : false,
        hasMention: false, // wire up when mentions are implemented
      };
    }),
  );

  // 6. Format group rooms
  const rooms = userRooms
    .filter((r) => r.type !== "DIRECT")
    .map((room) => ({
      id: room.id,
      name: room.name,
      type: room.type,
      members: room.roomMembers.map((rm) => rm.user),
      hasUnread: hasUnreadByRoomId.has(room.id),
      hasMention: false,
    }));

  return { data: { rooms, chats } };
};


// const getRooms = async (
//   request: FastifyRequest<getRoomsRequest>,
//   reply: FastifyReply,
// ) => {
//   const userId = request.user.userId;
//   const workspaceId = request.params.workspaceId;

//   // 1. Workspace members
//   const workspaceMembers = await prisma.workspaceMember.findMany({
//     where: { workspaceId, NOT: { userId } },
//     select: {
//       status: true,
//       lastSeenAt: true,
//       user: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//           email: true,
//           avatarId: true,
//         },
//       },
//     },
//   });

//   // 2. All rooms user is in (group + direct)
//   const userRooms = await prisma.room.findMany({
//     where: {
//       workspaceId,
//       roomMembers: { some: { userId } },
//     },
//     include: {
//       roomMembers: {
//         where: { userId }, // only need current user's row for lastReadAt
//         select: {
//           userId: true,
//           lastReadAt: true,
//           user: { select: { id: true, firstName: true, lastName: true } },
//         },
//       },
//       messages: { orderBy: { createdAt: "desc" }, take: 1 },
//     },
//   });

//   // 3. Compute unread per room (Prisma groupBy)
//   const unreadCounts = await prisma.message.groupBy({
//     by: ["roomId"],
//     where: {
//       roomId: { in: userRooms.map((r) => r.id) },
//       senderId: { not: userId },
//       deletedAt: null,
//       OR: userRooms.map((r) => {
//         const lastRead = r.roomMembers[0]?.lastReadAt;
//         return {
//           roomId: r.id,
//           ...(lastRead ? { createdAt: { gt: lastRead } } : {}),
//         };
//       }),
//     },
//     _count: { id: true },
//   });

//   const unreadByRoomId = new Map(
//     unreadCounts.map((u) => [u.roomId, u._count.id]),
//   );

//   // 4. Build a lookup: otherUserId → directRoomId for direct rooms
//   const directRoomByUserId = new Map<string, string>();
//   for (const room of userRooms) {
//     if (room.type !== "DIRECT") continue;
//     // uniqueKey is workspaceId_userA_userB, parse out the other user
//     const otherUserId = room.uniqueKey
//       ?.split("_")
//       .find((id) => id !== workspaceId && id !== userId);
//     if (otherUserId) directRoomByUserId.set(otherUserId, room.id);
//   }

//   // 5. Format chats (workspace members)
//   const directChatCandidates = await Promise.all(
//     workspaceMembers.map(async (member) => {
//       const directRoomId = directRoomByUserId.get(member.user.id);
//       const unreadCount = directRoomId
//         ? (unreadByRoomId.get(directRoomId) ?? 0)
//         : 0;

//       return {
//         id: member.user.id, // still the userId — keep your existing approach
//         name: `${member.user.firstName} ${member.user.lastName}`,
//         email: member.user.email,
//         avatar: member.user.avatarId
//           ? await getFileUrl(member.user.avatarId)
//           : null,
//         type: "DIRECT",
//         status: member.status,
//         lastSeenAt: member.lastSeenAt,
//         unreadCount,
//         hasMention: false, // wire up later if you add mentions
//       };
//     }),
//   );

//   // 6. Format group rooms
//   const formattedRooms = userRooms
//     .filter((r) => r.type !== "DIRECT")
//     .map((room) => ({
//       id: room.id,
//       name: room.name,
//       type: room.type,
//       members: room.roomMembers.map((rm) => rm.user),
//       lastMessage: room.messages[0]?.content ?? null,
//       unreadCount: unreadByRoomId.get(room.id) ?? 0,
//       hasMention: false,
//     }));

//   return { data: { rooms: formattedRooms, chats: directChatCandidates } };
// };

export { getRooms };

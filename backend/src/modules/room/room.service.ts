import { createRoom, findRoom } from "./room.repository";
import prisma from "@/lib/prisma";
import { getFileUrl } from "../storage/storage.service";

const joinDirectRoomService = async (
  workspaceId: string,
  targetUserId: string,
  currentUserId: string,
) => {
  const sorted = [currentUserId, targetUserId].sort();
  const uniqueKey = `${workspaceId}_${sorted[0]}_${sorted[1]}`;

  let room = await findRoom({ uniqueKey });

  if (!room) {
    room = await createRoom({
      workspaceId,
      type: "DIRECT",
      uniqueKey,
      name: "direct",
      roomMembers: {
        create: [{ userId: currentUserId }, { userId: targetUserId }],
      },
    });
  }

  return room.id;
};

const getRoomsService = async (userId: string, workspaceId: string) => {
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
  const getLastMessageAt = (room: (typeof userRooms)[number]) =>
    room.messages[0]?.createdAt ?? new Date(0);

  const sortedRooms = [...userRooms].sort(
    (a, b) => getLastMessageAt(b).getTime() - getLastMessageAt(a).getTime(),
  );
  const roomLastMessageMap = new Map(
    sortedRooms.map((r) => [r.id, r.messages[0]?.createdAt ?? new Date(0)]),
  );
  const getRoomLastMessageAt = (roomId?: string) =>
    roomLastMessageMap.get(roomId ?? "") ?? new Date(0);

  // 3. Compute hasUnread per room — one query, returns roomIds that have unread messages
  const roomsWithUnread = await prisma.message.findMany({
    where: {
      senderId: { not: userId },
      deletedAt: null,
      OR: sortedRooms.map((r) => ({
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
  for (const room of sortedRooms) {
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
        roomId: directRoomId,
        hasUnread: directRoomId ? hasUnreadByRoomId.has(directRoomId) : false,
        hasMention: false, // wire up when mentions are implemented
      };
    }),
  );

  const sortedChats = [...chats].sort((a, b) => {
    const aRoomId = directRoomByUserId.get(a.id);
    const bRoomId = directRoomByUserId.get(b.id);

    return (
      getRoomLastMessageAt(bRoomId).getTime() -
      getRoomLastMessageAt(aRoomId).getTime()
    );
  });

  // 6. Format group rooms
  const rooms = sortedRooms
    .filter((r) => r.type !== "DIRECT")
    .map((room) => ({
      id: room.id,
      name: room.name,
      type: room.type,
      members: room.roomMembers.map((rm) => rm.user),
      hasUnread: hasUnreadByRoomId.has(room.id),
      hasMention: false,
    }));

  return { chats: sortedChats, rooms };
};

export { joinDirectRoomService, getRoomsService };

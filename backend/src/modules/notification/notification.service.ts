import prisma from "@/lib/prisma";

// Mark ALL of a user's notifications read (across the whole workspace)
export async function markAllNotificationsRead(args: {
  userId: string;
  workspaceId: string;
}) {
  return prisma.notification.updateMany({
    where: {
      userId: args.userId,
      workspaceId: args.workspaceId,
      isRead: false,
    },
    data: { isRead: true },
  });
}

// Mark all notifications read for ONE room (call when user opens that room)
export async function markRoomNotificationsRead(args: {
  userId: string;
  roomId: string;
}) {
  return prisma.notification.updateMany({
    where: {
      userId: args.userId,
      roomId: args.roomId,
      isRead: false,
    },
    data: { isRead: true },
  });
}

// Mark a single notification read (e.g. user clicks one in the feed)
export async function markNotificationRead(args: {
  userId: string;
  notificationId: string;
}) {
  // userId in the where clause prevents User A marking User B's notification read
  return prisma.notification.updateMany({
    where: {
      id: args.notificationId,
      userId: args.userId,
    },
    data: { isRead: true },
  });
}

type GetNotificationsArgs = {
  userId: string;
  workspaceId: string;
  limit?: number;
  cursor?: string;        // the id of the last notification from the previous page
  unreadOnly?: boolean;   // optional filter
};

export async function getNotifications(args: GetNotificationsArgs) {
  const limit = Math.min(args.limit ?? 20, 50); // cap it — don't let clients ask for 10,000

  const items = await prisma.notification.findMany({
    where: {
      userId: args.userId,
      workspaceId: args.workspaceId,
      ...(args.unreadOnly ? { isRead: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1, // fetch one extra to detect if there's a next page
    ...(args.cursor
      ? { cursor: { id: args.cursor }, skip: 1 } // skip the cursor row itself
      : {}),
    include: {
      actor: {
        select: { id: true, firstName: true, lastName: true, avatarId: true },
      },
      room: { select: { id: true, name: true } },
    },
  });

  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;

  return {
    notifications: page,
    nextCursor: hasMore ? page[page.length - 1].id : null,
    hasMore,
  };
}

export async function getUnreadCount(args: {
  userId: string;
  workspaceId: string;
}) {
  return prisma.notification.count({
    where: { userId: args.userId, workspaceId: args.workspaceId, isRead: false },
  });
}
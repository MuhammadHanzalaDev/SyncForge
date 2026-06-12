import prisma from "@/lib/prisma";
import * as NotificationSchema from "./notification.schema";

// Mark ALL of a user's notifications reads
export async function markAllNotificationsRead(
  userId: string,
  workspaceId: string,
) {
  const parsed = NotificationSchema.markAllNotificationsReadSchema.parse({
    userId,
    workspaceId,
  });

  return prisma.notification.updateMany({
    where: {
      userId: parsed.userId,
      workspaceId: parsed.workspaceId,
      isRead: false,
    },
    data: { isRead: true },
  });
}

// Mark all notifications read for ONE room
export async function markRoomNotificationsRead(
  userId: string,
  roomId: string,
) {
  return prisma.notification.updateMany({
    where: {
      userId: userId,
      roomId: roomId,
      isRead: false,
    },
    data: { isRead: true },
  });
}

// Mark a single notification read
export async function markNotificationRead(
  userId: string,
  notificationId: string,
) {
  const parsed = NotificationSchema.markNotificationReadSchema.parse({
    userId,
    notificationId,
  });

  return prisma.notification.updateMany({
    where: {
      id: parsed.notificationId,
      userId: parsed.userId,
    },
    data: { isRead: true },
  });
}

type GetNotificationsArgs = {
  userId: string;
  workspaceId: string;
  limit?: number;
  cursor?: string;
  unreadOnly?: boolean;
};

export async function getNotifications(args: GetNotificationsArgs) {
  const parsed = NotificationSchema.getNotificationsSchema.parse(args);

  const limit = Math.min(parsed.limit ?? 20, 50);

  const items = await prisma.notification.findMany({
    where: {
      userId: parsed.userId,
      workspaceId: parsed.workspaceId,
      ...(parsed.unreadOnly ? { isRead: false } : {}),
    },

    orderBy: { createdAt: "desc" },

    take: limit + 1,
    ...(parsed.cursor ? { cursor: { id: parsed.cursor }, skip: 1 } : {}),

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

export async function getUnreadCount(userId: string, workspaceId: string) {
  const parsed = NotificationSchema.getUnreadCountSchema.parse({
    userId,
    workspaceId,
  });

  return prisma.notification.count({
    where: {
      userId: parsed.userId,
      workspaceId: parsed.workspaceId,
      isRead: false,
    },
  });
}

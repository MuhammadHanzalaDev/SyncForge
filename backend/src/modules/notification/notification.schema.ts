import z from "zod";

const markAllNotificationsReadSchema = z.object({
  userId: z.string("userId is required!"),
  workspaceId: z.string("workspaceId is required!"),
});

const markNotificationReadSchema = z.object({
  userId: z.string("userId is required!"),
  notificationId: z.string("notificationId is required!"),
});

const getNotificationsSchema = z.object({
  userId: z.string("userId is required!"),
  workspaceId: z.string("workspaceId is required!"),
  limit: z.number().optional(),
  cursor: z.string().optional(),
  unreadOnly: z.boolean().optional(),
});

const getUnreadCountSchema = z.object({
  userId: z.string("userId is required!"),
  workspaceId: z.string("workspaceId is required!"),
});

export {
  markAllNotificationsReadSchema,
  markNotificationReadSchema,
  getNotificationsSchema,
  getUnreadCountSchema,
};

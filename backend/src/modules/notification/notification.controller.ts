import { FastifyRequest } from "fastify";
import * as NotificationService from "./notification.service";

interface markAllNotificationsReadRequest {
  Body: { workspaceId: string };
}
const markAllNotificationsRead = async (
  request: FastifyRequest<markAllNotificationsReadRequest>,
) => {
  const userId = request.user.userId;
  const workspaceId = request.body.workspaceId;

  await NotificationService.markAllNotificationsRead(userId, workspaceId);

  return;
};

interface markNotificationReadRequest {
  Body: { workspaceId: string };
  Querystring: { notificationId: string };
}
const markNotificationRead = async (
  request: FastifyRequest<markNotificationReadRequest>,
) => {
  const userId = request.user.userId;
  const notificationId = request.query.notificationId;

  await NotificationService.markNotificationRead(userId, notificationId);

  return;
};

interface getNotificationsRequest {
  Body: {
    workspaceId: string;
    limit: number;
    cursor: string;
    unreadOnly: boolean;
  };
}
const getNotifications = async (
  request: FastifyRequest<getNotificationsRequest>,
) => {
  const userId = request.user.userId;
  const body = request.body;

  const data = await NotificationService.getNotifications({ ...body, userId });

  return { data };
};

interface getUnreadCountRequest {
  Body: { workspaceId: string };
}
const getUnreadCount = async (
  request: FastifyRequest<getUnreadCountRequest>,
) => {
  const userId = request.user.userId;
  const workspaceId = request.body.workspaceId;

  await NotificationService.getUnreadCount(userId, workspaceId);

  return;
};

export {
  markAllNotificationsRead,
  markNotificationRead,
  getNotifications,
  getUnreadCount,
};

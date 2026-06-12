import { FastifyPluginAsync } from "fastify";
import * as notificationController from "./notification.controller";

const notificationRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);

  app.post("/read-all", notificationController.markAllNotificationsRead);
  app.post(
    "/:notificationId/read",
    notificationController.markNotificationRead,
  );
  app.get("/", notificationController.getNotifications);
  app.get("/unread", notificationController.getUnreadCount);
};

export default notificationRoutes;

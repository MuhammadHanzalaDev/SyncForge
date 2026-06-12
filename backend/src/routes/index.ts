import { FastifyPluginAsync } from "fastify";
import authRoutes from "../modules/auth/auth.routes";
import workspaceRoutes from "@/modules/workspace/workspace.routes";
import storageRoutes from "@/modules/storage/storage.routes";
import userRoutes from "@/modules/user/user.routes";
import roomRoutes from "@/modules/room/room.routes";
import messageRoutes from "@/modules/message/message.routes";
import notificationRoutes from "@/modules/notification/notification.routes";

const routes: FastifyPluginAsync = async (app) => {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(workspaceRoutes, { prefix: "/workspaces" });
  app.register(storageRoutes, { prefix: "/files" });
  app.register(userRoutes, { prefix: "/users" });
  app.register(roomRoutes, { prefix: "/rooms" });
  app.register(messageRoutes, { prefix: "/messages" });
  app.register(notificationRoutes, { prefix: "/notifications" });
};

export default routes;

import { FastifyPluginAsync } from "fastify";
import authRoutes from "../modules/auth/auth.routes";
import workspaceRoutes from "@/modules/workspace/workspace.routes";
import storageRoutes from "@/modules/storage/storage.routes";

const routes: FastifyPluginAsync = async (app) => {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(workspaceRoutes, { prefix: "/workspaces" });
  app.register(storageRoutes, { prefix: "/files" });
};

export default routes;

import { FastifyPluginAsync } from "fastify";
import authRoutes from "../modules/auth/auth.routes";
import workspaceRoutes from "@/modules/workspace/workspace.routes";

const routes: FastifyPluginAsync = async (app) => {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(workspaceRoutes, { prefix: "/workspaces" });
};

export default routes;

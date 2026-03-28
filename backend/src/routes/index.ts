import { FastifyPluginAsync } from "fastify";
import authRoutes from "../modules/auth/auth.routes";
import workspaceRoutes from "@/modules/workspace/workspace.routes";
import storageRoutes from "@/modules/storage/storage.routes";
import userRoutes from "@/modules/user/user.routes";

const routes: FastifyPluginAsync = async (app) => {
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(workspaceRoutes, { prefix: "/workspaces" });
  await app.register(storageRoutes, { prefix: "/files" });
  await app.register(userRoutes, { prefix: "/users" });
};

export default routes;

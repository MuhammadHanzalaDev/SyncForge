import { FastifyPluginAsync } from "fastify";
import { getAllWorkspaces } from "./workspace.controller";

const workspaceRoutes: FastifyPluginAsync = async (app) => {
  // auth hook
  app.addHook("preHandler", app.authenticate);

  app.get("/", getAllWorkspaces);
};

export default workspaceRoutes;

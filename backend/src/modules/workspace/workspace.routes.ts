import { FastifyPluginAsync } from "fastify";
import {
  getAllWorkspaces,
  createWorkspace,
  joinWorkspace,
  getAllWorkspaceMembersforFilters,
  getAllWorkspaceMembersWithFiltersRequest,
} from "./workspace.controller";

declare module "fastify" {
  interface FastifyContextConfig {
    multipart?: {
      limits?: {
        fileSize?: number;
      };
    };
  }
}

const workspaceRoutes: FastifyPluginAsync = async (app) => {
  // auth hook
  app.get("/", { preHandler: app.authenticate }, getAllWorkspaces);
  app.post(
    "/",
    {
      preHandler: app.authenticate,
      config: {
        multipart: {
          limits: {
            fileSize: 2 * 1024 * 1024,
          },
        },
      },
    },
    createWorkspace,
  );
  app.get("/join", joinWorkspace);
  app.get<getAllWorkspaceMembersWithFiltersRequest>(
    "/members/filters",
    { preHandler: app.authenticate },
    getAllWorkspaceMembersforFilters,
  );
};

export default workspaceRoutes;

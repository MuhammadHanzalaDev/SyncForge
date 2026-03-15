import { FastifyPluginAsync } from "fastify";
import { getAllWorkspaces, createWorkspace } from "./workspace.controller";

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
  app.addHook("preHandler", app.authenticate);

  app.get("/", getAllWorkspaces);
  app.post(
    "/",
    {
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
};

export default workspaceRoutes;

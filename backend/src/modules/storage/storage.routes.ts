import { FastifyPluginAsync } from "fastify";
import { getFileUrlController } from "./storage.controller";

const storageRoutes: FastifyPluginAsync = async (app) => {
  app.get("/:id/url", getFileUrlController);
};

export default storageRoutes;

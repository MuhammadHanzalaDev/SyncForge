import { FastifyPluginAsync } from "fastify";
import {
  getFileUrlController,
  uploadAttachmentsController,
} from "./storage.controller";

const storageRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);
  
  app.get("/:id/url", getFileUrlController);
  app.post("/attachments", uploadAttachmentsController);
};

export default storageRoutes;

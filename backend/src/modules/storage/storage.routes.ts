import { FastifyPluginAsync } from "fastify";
import {
  getFileUrlController,
  uploadAttachmentsController,
} from "./storage.controller";

const storageRoutes: FastifyPluginAsync = async (app) => {
  app.get("/:id/url", getFileUrlController);
  app.post(
    "/attachments",
    { preHandler: app.authenticate },
    uploadAttachmentsController,
  );
};

export default storageRoutes;

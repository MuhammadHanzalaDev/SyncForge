import { FastifyPluginAsync } from "fastify";
import { getMessagesController } from "./message.controller";

const messageRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);

  app.get("/", getMessagesController);
};

export default messageRoutes;

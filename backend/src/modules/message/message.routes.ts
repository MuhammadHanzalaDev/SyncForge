import { FastifyPluginAsync } from "fastify";
import {
  getMessagesController,
  sendMessageController,
} from "./message.controller";

const messageRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);

  app.get("/:roomId", getMessagesController);
  app.post("/:roomId", sendMessageController);
};

export default messageRoutes;

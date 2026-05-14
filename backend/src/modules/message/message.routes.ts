import { FastifyPluginAsync } from "fastify";
import {
  getMessagesController,
  sendMessageController,
  readMessageController,
  messageReactionController,
} from "./message.controller";

const messageRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);

  app.get("/:roomId", getMessagesController);
  app.post("/:roomId", sendMessageController);
  app.post("/:roomId/:messageId/read", readMessageController);
  app.post("/:messageId/react", messageReactionController);
};

export default messageRoutes;

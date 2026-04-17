// modules/message/message.controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import { createMessageService, getMessagesService } from "./message.service";
import { GetMessageRequest, SendMessageRequest } from "./message.types";
import { getIO } from "@/lib/socket";
const io = getIO();

const getMessagesController = async (
  request: FastifyRequest<GetMessageRequest>,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { roomId } = request.params;
  const { cursor, limit = "20" } = request.query;

  const result = await getMessagesService({
    userId,
    roomId,
    cursor: cursor,
    limit: limit ? parseInt(limit) : 20,
  });

  return result;
};

const sendMessageController = async (
  request: FastifyRequest<SendMessageRequest>,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { roomId } = request.params;
  const data = request.body;

  const message = await createMessageService({
    ...data,
    roomId,
    senderId: userId,
  });

  // emit message
  io.to(roomId).emit("message:new", message);
  return { data: message };
};

export { getMessagesController, sendMessageController };

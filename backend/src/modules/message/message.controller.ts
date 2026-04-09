// modules/message/message.controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import { getMessagesService } from "./message.service";
import { GetMessageRequest } from "./message.types";

const getMessagesController = async (
  request: FastifyRequest<GetMessageRequest>,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { roomId } = request.params;
  const { cursor, limit } = request.query;

  const result = await getMessagesService({
    userId,
    roomId,
    cursor: cursor,
    limit: limit ? parseInt(limit) : 20,
  });

  return result;
};

export { getMessagesController };

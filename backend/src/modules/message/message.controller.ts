// modules/message/message.controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import {
  createMessageService,
  getMessagesService,
  readMessageService,
  messageReactionService,
} from "./message.service";
import {
  GetMessageRequest,
  ReadMessageRequest,
  SendMessageRequest,
  MessageReactionRequest,
} from "./message.types";
import { emitMessageReaction, emitMessageRead } from "./message.events";

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

  await createMessageService({
    ...data,
    roomId,
    senderId: userId,
  });

  return { data: null };
};

const readMessageController = async (
  request: FastifyRequest<ReadMessageRequest>,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { messageId, roomId } = request.params;

  const { data, roomMembers } = await readMessageService({
    userId,
    messageId,
    roomId,
  });
  if (data) emitMessageRead(data, roomMembers);

  return { data: null };
};

const messageReactionController = async (
  request: FastifyRequest<MessageReactionRequest>,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { messageId, roomId } = request.params;
  const { emoji } = request.body;

  const { data, memberIds } = await messageReactionService({
    userId,
    messageId,
    roomId,
    emoji,
  });
  if (data) emitMessageReaction(memberIds, data);

  return { data: null };
};

export {
  getMessagesController,
  sendMessageController,
  readMessageController,
  messageReactionController,
};

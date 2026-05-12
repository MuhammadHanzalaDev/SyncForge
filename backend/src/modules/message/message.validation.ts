import * as z from "zod";

const createMessageValidation = z.object({
  tempId: z.string("tempId is required!"), // For optimistic UI, not stored in DB
  senderId: z.string("senderId is required!"),
  roomId: z.string("roomId is required!"),
  content: z.string("content is required!"),
  parentId: z.string().optional(),
  attachmentIds: z.array(z.string()).default([]).optional(),
});

const messageReactionValidation = z.object({
  messageId: z.string("messageId is required!"),
  userId: z.string("userId is required!"),
  roomId: z.string("roomId is required!"),
  emoji: z.string("emoji is required!"),
});

export { createMessageValidation, messageReactionValidation };

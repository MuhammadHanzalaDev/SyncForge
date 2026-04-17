import * as z from "zod";

const createMessageValidation = z.object({
  senderId: z.string("senderId is required!"),
  roomId: z.string("roomId is required!"),
  content: z.string("content is required!"),
  parentId: z.string().optional(),
  attachmentIds: z.array(z.string()).default([]).optional(),
});

export { createMessageValidation };

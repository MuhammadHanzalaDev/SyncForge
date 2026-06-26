import z from "zod";

const createCallSchema = z.object({
  id: z.string("id is required!"),
  roomId: z.string("roomId is required!"),
  initiatorId: z.string("initiatorId is required!"),
  type: z.enum(["AUDIO", "VIDEO"]),
  participantIds: z.array(z.string()),
});

export { createCallSchema };

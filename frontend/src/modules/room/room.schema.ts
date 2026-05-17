import { z } from "zod";

const createRoomSchema = z.object({
  name: z.string().min(3, "name must be atleast 3 characters."),
  type: z.enum(["PUBLIC", "PRIVATE", "DIRECT"], {
    errorMap: () => ({ message: "Please select a room type" }),
  }),
  memberIds: z.array(z.string()).optional(),
});

export { createRoomSchema };

import * as z from "zod";

const createRoomSchema = z.object({
  workspaceId: z.string(),
  name: z.string().min(3, "name must be atleast 3 characters."),
  type: z.enum(["PUBLIC", "PRIVATE", "DIRECT"]),
  memberIds: z.array(z.string()).optional(),
});

export { createRoomSchema };

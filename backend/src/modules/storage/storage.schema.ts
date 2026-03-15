import z from "zod";

const createFileSchema = z.object({
  name: z.string(),
  key: z.string(),
  mimeType: z.string(),
  size: z.number(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  userId: z.string(),
});

export { createFileSchema }
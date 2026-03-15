import z from "zod";

const fileSchema = z.object({
  buffer: z.instanceof(Buffer),
  filename: z.string(),
  mimetype: z.string(),
  size: z.number(),
});

const createFileSchema = z.object({
  filename: z.string(),
  key: z.string(),
  mimetype: z.string(),
  size: z.number(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  userId: z.string(),
});

export { fileSchema, createFileSchema }
import z from "zod";

const validateFile = z.object({
  buffer: z.instanceof(Buffer),
  filename: z.string(),
  mimetype: z.string(),
  size: z.number(),
});

const validateCreateFile = z.object({
  filename: z.string(),
  key: z.string(),
  mimetype: z.string(),
  size: z.number(),
  userId: z.string(),
  status: z.string().optional(),
  kind: z.enum(["IMAGE", "FILE"]).optional(),
});

export { validateFile, validateCreateFile }
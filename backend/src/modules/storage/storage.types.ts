import z from "zod";
import { createFileSchema } from "./storage.validation";

interface FileType {
  id?: string;
  name?: string;
  key?: string;
  mimeType?: string;
  size?: number;
  userId?: string;
  createdAt?: Date | string;
}

type CreateFileType = z.infer<typeof createFileSchema>;

export type { FileType, CreateFileType };

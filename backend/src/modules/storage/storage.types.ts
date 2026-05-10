type FileKind = "IMAGE" | "FILE" | "VOICE";
interface FileType {
  id?: string;
  name?: string;
  key?: string;
  mimeType?: string;
  size?: number;
  userId?: string;
  createdAt?: Date | string;
  messageId?: string;
  status?: string;
  kind?: FileKind;
  durationSec?: number;
}

type UploadedFile = {
  fieldname?: string;
  buffer: Buffer;
  filename: string;
  mimetype: string;
  size: number;
};

export type { FileType, UploadedFile, FileKind };

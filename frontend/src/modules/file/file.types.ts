type Attachment = {
  id: string;
  file: File;
  kind: "IMAGE" | "FILE";
  previewUrl?: string;
  status: "uploading" | "done" | "error";
  uploadedId?: string;
};

type MessageAttachmentsHandle = {
  /** Opens the OS file picker in "any file" mode. */
  openFilePicker: () => void;
  /** Opens the OS file picker restricted to images. */
  openImagePicker: () => void;
  /** Revokes all preview URLs and clears attachments. Call after send. */
  clear: () => void;
};

type NormalizedAttachment = {
  id: string;
  kind: "IMAGE" | "FILE";
  filename: string;
  size?: number;
  /** URL to render (object URL for temp, backend URL for persisted) */
  src?: string;
  /** For file-icon lookup when kind === "FILE" */
  mimetype?: string;
};

export type { Attachment, MessageAttachmentsHandle, NormalizedAttachment };

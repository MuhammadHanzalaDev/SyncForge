type AttachmentKind = "IMAGE" | "FILE" | "VOICE";
type AttachmentStatus = "uploading" | "done" | "error";

type Attachment = {
  id: string;
  file: File;
  kind: AttachmentKind;
  previewUrl?: string;
  status: AttachmentStatus;
  uploadedId?: string;
  durationSec?: number;
};

type MessageAttachmentsHandle = {
  /** Opens the OS file picker in "any file" mode. */
  openFilePicker: () => void;
  /** Opens the OS file picker restricted to images. */
  openImagePicker: () => void;
  /** Revokes all preview URLs and clears attachments. Call after send. */
  clear: () => void;

  addFiles: (files: File[], kind?: AttachmentKind, meta?: { durationSec?: number }) => void; // new
};

type NormalizedAttachment = {
  id: string;
  kind: AttachmentKind;
  filename: string;
  size?: number;
  /** URL to render (object URL for temp, backend URL for persisted) */
  src?: string;
  /** For file-icon lookup when kind === "FILE" */
  mimetype?: string;
  durationSec?: number;
};

export type {
  Attachment,
  MessageAttachmentsHandle,
  NormalizedAttachment,
  AttachmentKind,
  AttachmentStatus,
};

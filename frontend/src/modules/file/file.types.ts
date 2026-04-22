type Attachment = {
  id: string;
  file: File;
  kind: "image" | "file";
  previewUrl?: string;
};

type MessageAttachmentsHandle = {
  /** Opens the OS file picker in "any file" mode. */
  openFilePicker: () => void;
  /** Opens the OS file picker restricted to images. */
  openImagePicker: () => void;
  /** Revokes all preview URLs and clears attachments. Call after send. */
  clear: () => void;
};

export type { Attachment, MessageAttachmentsHandle };

"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Loader2, X, Mic } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Attachment,
  MessageAttachmentsHandle,
  AttachmentKind,
} from "@/modules/file/file.types";
import { formatFileSize, getFileIcon } from "@/modules/file/file.utils";
import { useUploadAttachments } from "@/modules/file/file.mutation";
import { objectToFormData } from "@/shared/utils/formData";
import Image from "next/image";

type Props = {
  attachments: Attachment[];
  onAttachmentsChange: Dispatch<SetStateAction<Attachment[]>>;
  className?: string;
};

const createAttachments = (
  files: File[],
  forceKind?: AttachmentKind,
  meta?: { durationSec?: number },
): Attachment[] =>
  files.map((file) => {
    const isImage =
      forceKind === "IMAGE" || (!forceKind && file.type.startsWith("image/"));
    const isVoice = forceKind === "VOICE";
    const kind: AttachmentKind = isVoice ? "VOICE" : isImage ? "IMAGE" : "FILE";
    return {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      kind,
      previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      status: "uploading",
      durationSec: meta?.durationSec,
    };
  });

// ------- Component -------

const MessageAttachments = forwardRef<MessageAttachmentsHandle, Props>(
  function MessageAttachments(
    { attachments, onAttachmentsChange, className },
    ref,
  ) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const { mutateAsync: uploadAttachment } = useUploadAttachments();

    useEffect(() => {
      return () => {
        attachments.forEach((a) => {
          if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
        });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        openFilePicker: () => fileInputRef.current?.click(),
        openImagePicker: () => imageInputRef.current?.click(),
        addFiles: (files, kind, meta) => handleFilesSelected(files, kind, meta),
        clear: () => {
          attachments.forEach((a) => {
            if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
          });
          onAttachmentsChange([]);
        },
      }),
      [attachments, onAttachmentsChange],
    );

    const uploadSingle = async (attachment: Attachment) => {
      const formData = objectToFormData({
        file: attachment.file,
        kind: attachment.kind,
      });

      try {
        const uploaded = await uploadAttachment(formData);
        const result = Array.isArray(uploaded) ? uploaded[0] : uploaded;

        onAttachmentsChange((prev) =>
          prev.map((a) =>
            a.id === attachment.id
              ? { ...a, status: "done", uploadedId: result?.id }
              : a,
          ),
        );
      } catch {
        onAttachmentsChange((prev) =>
          prev.map((a) =>
            a.id === attachment.id ? { ...a, status: "error" } : a,
          ),
        );
      }
    };

    const handleFilesSelected = (
      files: FileList | File[] | null,
      forceKind?: AttachmentKind,
      meta?: { durationSec?: number },
    ) => {
      if (!files) return;
      const arr = Array.from(files);
      if (arr.length === 0) return;

      const batch = createAttachments(arr, forceKind, meta);
      onAttachmentsChange((prev) => [...prev, ...batch]);
      batch.forEach(uploadSingle);
    };

    const removeAttachment = (id: string) => {
      onAttachmentsChange((prev) => {
        const target = prev.find((a) => a.id === id);
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
        return prev.filter((a) => a.id !== id);
      });
    };

    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFilesSelected(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFilesSelected(e.target.files, "IMAGE");
            e.target.value = "";
          }}
        />

        {attachments.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-3 px-4 pt-3 pb-1 border-b",
              className,
            )}
          >
            {attachments.map((att) => {
              const isUploading = att.status === "uploading";
              const isError = att.status === "error";

              if (att.kind === "VOICE") {
                return (
                  <VoicePreviewTile
                    key={att.id}
                    attachment={att}
                    isUploading={isUploading}
                    isError={isError}
                    onRemove={() => removeAttachment(att.id)}
                  />
                );
              }

              if (att.kind === "IMAGE" && att.previewUrl) {
                return (
                  <div
                    key={att.id}
                    className="relative h-16 w-16 rounded-lg overflow-hidden border bg-muted group"
                  >
                    <Image
                      src={att.previewUrl}
                      alt={att.file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />

                    <UploadOverlay
                      isUploading={isUploading}
                      isError={isError}
                    />

                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="absolute top-1 right-1 z-20 flex items-center justify-center h-4 w-4 rounded-full bg-foreground text-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                );
              }

              const Icon = getFileIcon(att.file);
              return (
                <div
                  key={att.id}
                  className="group relative flex items-center gap-2 pl-2 pr-2 py-2 rounded-lg border bg-muted/40 hover:bg-muted/60 transition-colors min-w-40 max-w-55"
                >
                  <UploadOverlay isUploading={isUploading} isError={isError} />

                  <div className="flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-primary/10 text-primary dark:bg-primary/20">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium truncate text-foreground">
                      {att.file.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isError
                        ? "Upload failed"
                        : formatFileSize(att.file.size)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    aria-label={`Remove ${att.file.name}`}
                    className="z-20 shrink-0 flex items-center justify-center h-5 w-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  },
);

// ------- Upload overlay -------

type UploadOverlayProps = {
  isUploading: boolean;
  isError: boolean;
};

function UploadOverlay({ isUploading, isError }: UploadOverlayProps) {
  if (!isUploading && !isError) return null;

  return (
    <>
      {isUploading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20 overflow-hidden z-10">
          <div className="h-full w-1/3 bg-primary animate-[indeterminate_1.2s_ease-in-out_infinite]" />
        </div>
      )}

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center pointer-events-none z-5",
          isError ? "bg-destructive/30" : "bg-black/35",
        )}
      >
        {isUploading && (
          <Loader2 className="h-4 w-4 animate-spin text-white drop-shadow" />
        )}
      </div>
    </>
  );
}

export default MessageAttachments;

type VoicePreviewTileProps = {
  attachment: Attachment;
  isUploading: boolean;
  isError: boolean;
  onRemove: () => void;
};

// ------- Voice Preview -------

function VoicePreviewTile({
  attachment,
  isUploading,
  isError,
  onRemove,
}: VoicePreviewTileProps) {
  const seconds = attachment.durationSec ?? 0;
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="group relative flex items-center gap-2 pl-2 pr-2 py-2 rounded-lg border bg-muted/40 hover:bg-muted/60 transition-colors min-w-40 max-w-55">
      <UploadOverlay isUploading={isUploading} isError={isError} />

      <div className="flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-primary/10 text-primary dark:bg-primary/20">
        <Mic className="h-4 w-4" />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-medium truncate text-foreground">
          Voice message
        </span>
        <span className="text-[10px] text-muted-foreground">
          {isError ? "Upload failed" : `${mm}:${ss}`}
        </span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove voice message"
        className="z-20 shrink-0 flex items-center justify-center h-5 w-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

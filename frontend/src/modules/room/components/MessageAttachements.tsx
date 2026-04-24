"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Loader2, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Attachment,
  MessageAttachmentsHandle,
} from "@/modules/file/file.types";
import { formatFileSize, getFileIcon } from "@/modules/file/file.utils";
import { useUploadAttachments } from "@/modules/file/file.mutation";
import { objectToFormData } from "@/shared/utils/formData";

type Props = {
  attachments: Attachment[];
  onAttachmentsChange: Dispatch<SetStateAction<Attachment[]>>;
  className?: string;
};

const createAttachments = (
  files: FileList,
  forceKind?: "IMAGE" | "FILE",
): Attachment[] =>
  Array.from(files).map((file) => {
    const isImage = forceKind === "IMAGE" || file.type.startsWith("image/");
    return {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      kind: isImage ? "IMAGE" : "FILE",
      previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      status: "uploading",
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

    // Revoke any lingering object URLs on unmount.
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
        clear: () => {
          attachments.forEach((a) => {
            if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
          });
          onAttachmentsChange([]);
        },
      }),
      [attachments, onAttachmentsChange],
    );

    // Upload a single attachment and update its status when done.
    const uploadSingle = async (attachment: Attachment) => {
      const formData = objectToFormData({
        file: attachment.file,
        kind: attachment.kind,
      });

      try {
        const uploaded = await uploadAttachment(formData);
        console.log(uploaded);
        // Expect backend to return the uploaded file object (or array with one item).
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
      files: FileList | null,
      forceKind?: "IMAGE" | "FILE",
    ) => {
      if (!files || files.length === 0) return;

      const batch = createAttachments(files, forceKind);
      onAttachmentsChange((prev) => [...prev, ...batch]);

      // Fire one request per file in parallel.
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
        {/* Hidden file inputs — always mounted so refs are available */}
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

        {/* Preview strip — only rendered when there are attachments */}
        {attachments.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-2 px-3 pt-3 pb-1 border-b",
              className,
            )}
          >
            {attachments.map((att) => {
              const isUploading = att.status === "uploading";
              const isError = att.status === "error";

              if (att.kind === "IMAGE" && att.previewUrl) {
                return (
                  <div
                    key={att.id}
                    className="group relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={att.previewUrl}
                      alt={att.file.name}
                      className="h-full w-full object-cover"
                    />

                    <UploadOverlay
                      isUploading={isUploading}
                      isError={isError}
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      aria-label={`Remove ${att.file.name}`}
                      className="absolute top-0.5 right-0.5 z-10 flex items-center justify-center h-5 w-5 rounded-full bg-background/90 text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              }

              const Icon = getFileIcon(att.file);
              return (
                <div
                  key={att.id}
                  className="group relative flex items-center gap-2.5 pl-2 pr-8 py-2 rounded-lg border bg-muted/40 hover:bg-muted/60 transition-colors max-w-[220px] overflow-hidden"
                >
                  <UploadOverlay isUploading={isUploading} isError={isError} />

                  <div className="flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium truncate">
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
                    className="absolute top-1/2 -translate-y-1/2 right-1.5 z-10 flex items-center justify-center h-5 w-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
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
      {/* Indeterminate top progress bar */}
      {isUploading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20 overflow-hidden z-10">
          <div className="h-full w-1/3 bg-primary animate-[indeterminate_1.2s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Dim overlay with centered spinner */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center pointer-events-none z-[5]",
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

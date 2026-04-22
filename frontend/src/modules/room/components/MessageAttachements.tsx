"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Attachment, MessageAttachmentsHandle } from "@/modules/file/file.types";
import { formatFileSize, getFileIcon } from "@/modules/file/file.utils";

type Props = {
  attachments: Attachment[];
  onAttachmentsChange: Dispatch<SetStateAction<Attachment[]>>;
  className?: string;
};

const createAttachments = (
  files: FileList,
  forceKind?: "image" | "file",
): Attachment[] =>
  Array.from(files).map((file) => {
    const isImage = forceKind === "image" || file.type.startsWith("image/");
    return {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      kind: isImage ? "image" : "file",
      previewUrl: isImage ? URL.createObjectURL(file) : undefined,
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

    const handleFilesSelected = (
      files: FileList | null,
      forceKind?: "image" | "file",
    ) => {
      if (!files || files.length === 0) return;
      const next = createAttachments(files, forceKind);
      onAttachmentsChange((prev) => [...prev, ...next]);
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
            handleFilesSelected(e.target.files, "image");
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
              if (att.kind === "image" && att.previewUrl) {
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      aria-label={`Remove ${att.file.name}`}
                      className="absolute top-0.5 right-0.5 flex items-center justify-center h-5 w-5 rounded-full bg-background/90 text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
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
                  className="group relative flex items-center gap-2.5 pl-2 pr-8 py-2 rounded-lg border bg-muted/40 hover:bg-muted/60 transition-colors max-w-[220px]"
                >
                  <div className="flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium truncate">
                      {att.file.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatFileSize(att.file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    aria-label={`Remove ${att.file.name}`}
                    className="absolute top-1/2 -translate-y-1/2 right-1.5 flex items-center justify-center h-5 w-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
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

export default MessageAttachments;

"use client";

import { Download } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Attachment } from "@/modules/file/file.types";
import type { MessageAttachment } from "@/modules/message/message.types";
import { formatFileSize, getFileIcon } from "@/modules/file/file.utils";

type Props = {
  /** Persisted attachments from backend (for confirmed messages) */
  attachments?: MessageAttachment[];
  /** Local attachments during optimistic send (carry File + upload status) */
  tempAttachments?: Attachment[];
  isOwn?: boolean;
};

/**
 * Normalized shape used internally so image/file rendering code doesn't care
 * whether the data came from the server or from a local optimistic state.
 */
type NormalizedAttachment = {
  id: string;
  kind: "IMAGE" | "FILE";
  filename: string;
  size?: number;
  /** URL to render (object URL for temp, backend URL for persisted) */
  src?: string;
  /** For file-icon lookup when kind === "file" */
  mimetype?: string;
};

function normalize(
  attachments?: MessageAttachment[],
  tempAttachments?: Attachment[],
): NormalizedAttachment[] {
  const fromServer: NormalizedAttachment[] = (attachments ?? []).map((a) => ({
    id: a.id,
    kind: a.kind,
    filename: a.filename,
    size: a.size,
    src: a.url,
    mimetype: a.mimetype,
  }));

  const fromLocal: NormalizedAttachment[] = (tempAttachments ?? []).map(
    (a) => ({
      id: a.id,
      kind: a.kind === "IMAGE" ? "IMAGE" : "FILE",
      filename: a.file.name,
      size: a.file.size,
      src: a.previewUrl,
      mimeType: a.file.type,
    }),
  );

  return [...fromServer, ...fromLocal];
}

export default function MessageAttachmentsList({
  attachments,
  tempAttachments,
  isOwn,
}: Props) {
  const items = normalize(attachments, tempAttachments);
  if (items.length === 0) return null;

  // Split for layout: images go in a grid, files stack vertically.
  const images = items.filter((i) => i.kind === "IMAGE");
  const files = items.filter((i) => i.kind === "FILE");

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 mt-1",
        isOwn ? "items-end" : "items-start",
      )}
    >
      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-1 max-w-sm",
            images.length === 1 && "grid-cols-1",
            images.length === 2 && "grid-cols-2",
            images.length >= 3 && "grid-cols-2",
          )}
        >
          {images.map((img) => (
            <ImageTile key={img.id} item={img} single={images.length === 1} />
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-1">
          {files.map((file) => (
            <FileTile key={file.id} item={file} isOwn={isOwn} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Image tile ----------

function ImageTile({
  item,
  single,
}: {
  item: NormalizedAttachment;
  single: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-muted",
        single ? "max-h-80" : "h-32",
      )}
    >
      {item.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.filename}
          className={cn("h-full w-full object-cover transition-opacity")}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          {item.filename}
        </div>
      )}
    </div>
  );
}

// ---------- File tile ----------

function FileTile({
  item,
  isOwn,
}: {
  item: NormalizedAttachment;
  isOwn?: boolean;
}) {
  // getFileIcon expects a File — fall back to a synthetic object shape.
  const Icon = getFileIcon({
    name: item.filename,
    type: item.mimetype ?? "",
  } as File);

  const content = (
    <>
      <div
        className={cn(
          "flex items-center justify-center h-9 w-9 shrink-0 rounded-md",
          isOwn
            ? "bg-primary-foreground/15 text-primary-foreground"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-medium truncate">{item.filename}</span>
        <span
          className={cn(
            "text-[10px]",
            isOwn ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatFileSize(item.size || 0)}
        </span>
      </div>

      {item.src && (
        <Download
          className={cn(
            "h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-70 transition-opacity",
            isOwn ? "text-primary-foreground" : "text-muted-foreground",
          )}
        />
      )}
    </>
  );

  const className = cn(
    "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg border max-w-[260px] transition-colors",
    isOwn
      ? "bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/15"
      : "bg-muted/40 border-border hover:bg-muted/60",
  );

  // Only render as a link when we have a real URL (backend attachment).
  if (item.src) {
    return (
      <a
        href={item.src}
        target="_blank"
        rel="noopener noreferrer"
        download={item.filename}
        className={className}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

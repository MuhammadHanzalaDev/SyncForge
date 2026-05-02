"use client";

import { cn } from "@/shared/lib/utils";
import type { Attachment } from "@/modules/file/file.types";
import type { MessageAttachment } from "@/modules/message/message.types";
import { NormalizedAttachment } from "@/modules/file/file.types";
import ImageTile from "@/modules/file/components/ImageTile";
import FileTile from "@/modules/file/components/FileTile";

type Props = {
  attachments?: MessageAttachment[];
  tempAttachments?: Attachment[];
  isOwn?: boolean;
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
      mimetype: a.file.type,
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
          className="grid gap-1"
          style={{
            gridTemplateColumns:
              images.length === 1
                ? "1fr"
                : images.length === 2
                  ? "repeat(2, 1fr)"
                  : images.length === 3
                    ? "repeat(3, 1fr)"
                    : images.length === 4
                      ? "repeat(2, 1fr)"
                      : "repeat(3, 1fr)",
            maxWidth:
              images.length === 1
                ? "320px"
                : images.length === 2
                  ? "324px"
                  : images.length === 3
                    ? "488px"
                    : images.length === 4
                      ? "324px"
                      : "488px",
          }}
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

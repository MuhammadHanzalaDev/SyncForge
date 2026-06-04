"use client";

import { cn } from "@/shared/lib/utils";
import type { Attachment } from "@/modules/file/file.types";
import type { MessageAttachment } from "@/modules/message/message.types";
import { NormalizedAttachment } from "@/modules/file/file.types";
import ImageTile from "@/modules/file/components/ImageTile";
import FileTile from "@/modules/file/components/FileTile";
import VoiceMessageTile from "@/modules/message/components/VoiceMessageTile";
import type { ReactNode } from "react";

type Props = {
  attachments?: MessageAttachment[];
  tempAttachments?: Attachment[];
  isOwn?: boolean;
  /** When present, rendered inside the last tile group instead of outside the bubble */
  metaNode?: ReactNode;
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
    durationSec: a.durationSec,
    isLocal: false,
  }));

  const fromLocal: NormalizedAttachment[] = (tempAttachments ?? []).map(
    (a) => ({
      id: a.id,
      kind: a.kind,
      filename: a.file.name,
      size: a.file.size,
      src: a.previewUrl,
      mimetype: a.file.type,
      durationSec: a.durationSec,
      isLocal: true,
    }),
  );

  return [...fromServer, ...fromLocal];
}

export default function MessageAttachmentsList({
  attachments,
  tempAttachments,
  isOwn,
  metaNode,
}: Props) {
  const items = normalize(attachments, tempAttachments);
  if (items.length === 0) return null;

  const images = items.filter((i) => i.kind === "IMAGE");
  const files = items.filter((i) => i.kind === "FILE");
  const voices = items.filter((i) => i.kind === "VOICE");

  // Decide which group is "last" so we know where to attach metaNode
  const hasVoices = voices.length > 0;
  const hasFiles = files.length > 0;
  const hasImages = images.length > 0;

  // Priority: files last > voices last > images last
  const metaTarget = hasFiles ? "files" : hasVoices ? "voices" : "images";

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 mt-1",
        isOwn ? "items-end" : "items-start",
      )}
    >
      {/* ── Images ── */}
      {hasImages && (
        <div className="relative">
          <div
            className="grid gap-1 rounded-lg overflow-hidden"
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

          {/* Meta overlaid on image grid bottom-right */}
          {metaNode && metaTarget === "images" && (
            <div className="absolute bottom-1.5 right-2 flex items-center gap-1 bg-black/40 rounded px-1 py-0.5">
              {metaNode}
            </div>
          )}
        </div>
      )}

      {/* ── Voice messages ── */}
      {hasVoices && (
        <div className="flex flex-col gap-1">
          {voices.map((v, idx) => (
            <VoiceMessageTile
              key={v.id}
              item={v}
              isOwn={isOwn}
              // inject meta into the last voice tile
              metaNode={
                metaNode && metaTarget === "voices" && idx === voices.length - 1
                  ? metaNode
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* ── File attachments ── */}
      {hasFiles && (
        <div className="flex flex-col gap-1">
          {files.map((file, idx) => (
            <FileTile
              key={file.id}
              item={file}
              isOwn={isOwn}
              // inject meta into the last file tile
              metaNode={
                metaNode && metaTarget === "files" && idx === files.length - 1
                  ? metaNode
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

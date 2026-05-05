"use client";

import { cn } from "@/shared/lib/utils";
import type { Message } from "@/modules/message/message.types";

type MessageReplyPreviewProps = {
  parent: NonNullable<Message["parent"]>;
  isOwn: boolean;
  currentUserId?: string;
  onClick?: () => void;
};

export default function MessageReplyPreview({
  parent,
  isOwn,
  currentUserId,
  onClick,
}: MessageReplyPreviewProps) {
  const isOwnParent = parent.sender.id === currentUserId;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-stretch gap-2 px-2 pt-2 w-full text-left",
        "hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
        isOwn && "flex-row-reverse",
      )}
    >
      {/* Accent bar */}
      <div
        className={cn(
          "w-0.75 shrink-0 rounded-full",
          isOwn ? "bg-primary-foreground/60" : "bg-primary/70",
        )}
      />

      {/* Inset card */}
      <div
        className={cn(
          "flex flex-col min-w-0 flex-1 rounded-lg px-2 py-1.5",
          isOwn ? "bg-primary-foreground/10" : "bg-background/60",
        )}
      >
        <span
          className={cn(
            "text-[11px] font-semibold leading-tight",
            isOwn ? "text-primary-foreground" : "text-primary",
          )}
        >
          {isOwnParent ? "You" : parent.sender.name}
        </span>
        <span
          className={cn(
            "text-xs truncate leading-snug",
            isOwn ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {parent.content?.trim() || "Attachment"}
        </span>
      </div>
    </button>
  );
}

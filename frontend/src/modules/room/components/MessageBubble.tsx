"use client";

import { useState } from "react";
import type { Message } from "@/modules/message/message.types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";
import { getInitials } from "../room.utils";
import { formatTime } from "@/shared/utils/date";
import { Reply, ThumbsUp, MoreVertical } from "lucide-react";
import MessageStatusIcon from "./MessageStatusIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import MessageAttachmentsList from "./MessageAttachmentsList";
import useMessageReadObserver from "../../message/hooks/useMessageReadObserver";

export default function MessageBubble({
  message,
  showAvatar,
  roomId,
}: {
  message: Message;
  showAvatar: boolean;
  roomId: string;
}) {
  // state
  const [hovered, setHovered] = useState(false);
  const hasAttachments =
    (message.attachments && message.attachments.length > 0) ||
    (message.tempAttachments && message.tempAttachments.length > 0);
  const hasText = message.content && message.content.trim().length > 0;

  // hooks
  const ref = useMessageReadObserver(
    message.id,
    roomId,
    message.status,
    message.isOwn || false,
  );

  return (
    <div
      className={cn(
        "flex gap-3 group px-4 py-1 hover:bg-muted/30 rounded-lg transition-colors",
        message.isOwn && "flex-row-reverse",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
    >
      {/* Avatar */}
      <div className="w-8 shrink-0 mt-1">
        {showAvatar && !message.isOwn && (
          <div className="relative">
            <Avatar className="h-8 w-8">
              {message.sender?.avatar ? (
                <AvatarImage
                  src={message.sender?.avatar}
                  alt={message.sender?.name}
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {getInitials(message.sender?.name)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          message.isOwn && "items-end",
        )}
      >
        {showAvatar && (
          <div
            className={cn(
              "flex items-baseline gap-2 mb-1",
              message.isOwn && "flex-row-reverse",
            )}
          >
            <span className="text-sm font-semibold text-foreground">
              {message.isOwn ? "You" : message.sender?.name}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        {/* Reply preview */}
        {/* {message.parentId && (
          <div
            className={cn(
              "flex items-center gap-2 mb-1.5 text-xs text-muted-foreground border-l-2 border-primary/40 pl-2 py-0.5",
              message.isOwn &&
                "flex-row-reverse border-l-0 border-r-2 pr-2 pl-0",
            )}
          >
            <Reply className="h-3 w-3 shrink-0" />
            <span className="font-medium">{message.replyTo.senderName}:</span>
            <span className="truncate max-w-[200px]">
              {message.replyTo.content}
            </span>
          </div>
        )} */}

        {/* Text bubble — only render when there's text content */}
        {hasText && (
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
              message.isOwn
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted text-foreground rounded-tl-sm",
            )}
          >
            {message.content}
          </div>
        )}

        {/* Attachments — renders both temp (optimistic) and persisted */}
        {hasAttachments && (
          <MessageAttachmentsList
            attachments={message.attachments}
            tempAttachments={message.tempAttachments}
            isOwn={message.isOwn}
          />
        )}

        {/* Reactions + status */}
        <div
          className={cn(
            "flex items-center gap-2 mt-1",
            message.isOwn && "flex-row-reverse",
          )}
        >
          {/* {message.reactions?.map((r) => (
            <button
              key={r.emoji}
              className={cn(
                "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border transition-colors",
                r.reacted
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-muted border-border hover:bg-muted/80",
              )}
            >
              {r.emoji} {r.count}
            </button>
          ))} */}
          {!showAvatar &&
            (message.isOwn ? (
              hovered && (
                <span className="text-[10px] text-muted-foreground">
                  {formatTime(message.createdAt)}
                </span>
              )
            ) : (
              <span
                className={`text-[10px] text-muted-foreground transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}
              >
                {formatTime(message.createdAt)}
              </span>
            ))}
          {message.isOwn && <MessageStatusIcon status={message.status} />}
        </div>
      </div>

      {/* Hover actions */}
      <div
        className={cn(
          "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-2",
          message.isOwn && "flex-row-reverse",
        )}
      >
        {[
          { icon: ThumbsUp, label: "React" },
          { icon: Reply, label: "Reply" },
          { icon: MoreVertical, label: "More" },
        ].map(({ icon: Icon, label }) => (
          <TooltipProvider key={label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

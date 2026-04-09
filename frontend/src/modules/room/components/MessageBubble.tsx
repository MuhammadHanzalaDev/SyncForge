"use client";

import { useState } from "react";
import type { Message } from "@/modules/message/message.types";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
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

export default function MessageBubble({
  message,
  showAvatar,
}: {
  message: Message;
  showAvatar: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex gap-3 group px-4 py-1 hover:bg-muted/30 rounded-lg transition-colors",
        message.isOwn && "flex-row-reverse",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div className="w-8 shrink-0 mt-1">
        {showAvatar && !message.isOwn && (
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                {getInitials(message.senderName)}
              </AvatarFallback>
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
              {message.isOwn ? "You" : message.senderName}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

        {/* Reply preview */}
        {message.replyTo && (
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
        )}

        {/* Bubble */}
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

        {/* Reactions + status */}
        <div
          className={cn(
            "flex items-center gap-2 mt-1",
            message.isOwn && "flex-row-reverse",
          )}
        >
          {message.reactions?.map((r) => (
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
          ))}
          {!showAvatar && (
            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTime(message.timestamp)}
            </span>
          )}
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

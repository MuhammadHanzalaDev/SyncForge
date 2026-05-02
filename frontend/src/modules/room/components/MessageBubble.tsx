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
import { usePersonalInfo } from "@/modules/user/user.query";
import { QUICK_REACTIONS } from "../room.content";

export default function MessageBubble({
  message,
  showAvatar,
  roomId,
  onReply,
  onReact,
}: {
  message: Message;
  showAvatar: boolean;
  roomId: string;
  // Parent sets these so the input box / reaction state lives outside this component.
  onReply?: (message: Message) => void;
  onReact?: (messageId: string, emoji: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  // Controls whether the quick-reaction strip is expanded in the toolbar.
  const [reactionsOpen, setReactionsOpen] = useState(false);

  const hasAttachments =
    (message.attachments && message.attachments.length > 0) ||
    (message.tempAttachments && message.tempAttachments.length > 0);
  const hasText = message.content && message.content.trim().length > 0;

  const { data: personalInfo } = usePersonalInfo();
  const isOwn = message.sender.id === personalInfo?.id;

  const ref = useMessageReadObserver(
    message.id,
    roomId,
    message.status,
    isOwn || false,
  );

  return (
    <div
      className={cn(
        "flex gap-3 group px-4 py-1 hover:bg-muted/30 rounded-lg transition-colors",
        isOwn && "flex-row-reverse",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setReactionsOpen(false);
      }}
      ref={ref}
    >
      {/* Avatar */}
      <div className="w-8 shrink-0 mt-1">
        {showAvatar && !isOwn && (
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
        )}
      </div>

      {/* Content */}
      <div className={cn("flex flex-col max-w-[70%]", isOwn && "items-end")}>
        {showAvatar && (
          <div
            className={cn(
              "flex items-baseline gap-2 mb-1",
              isOwn && "flex-row-reverse",
            )}
          >
            <span className="text-sm font-semibold text-foreground">
              {isOwn ? "You" : message.sender?.name}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        {/* ── Reply preview ──────────────────────────────────────────────
            Shows when this message is a reply to another.
            Requires message.parent to be populated (not just parentId).
            If you only have parentId, fetch the parent and pass it in,
            or include it in the Message type from your API response.     */}
        {/* {message.parent && (
          <button
            type="button"
            onClick={() => {}}
            className={cn(
              "flex items-start gap-2 mb-1 max-w-full text-left",
              "rounded-lg px-2.5 py-1.5 text-xs",
              "border-l-2 border-primary/50 bg-muted/60 hover:bg-muted transition-colors",
              isOwn && "border-l-0 border-r-2",
            )}
          >
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-primary text-[11px] mb-0.5">
                {message.parent.sender?.id === personalInfo?.id
                  ? "You"
                  : message.parent.sender?.name}
              </span>
              <span className="text-muted-foreground truncate max-w-[240px]">
                {message.parent.content || "Attachment"}
              </span>
            </div>
          </button>
        )} */}

        {/* Text bubble */}
        {hasText && (
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
              isOwn
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted text-foreground rounded-tl-sm",
            )}
          >
            {message.content}
          </div>
        )}

        {/* Attachments */}
        {hasAttachments && (
          <MessageAttachmentsList
            attachments={message.attachments}
            tempAttachments={message.tempAttachments}
            isOwn={isOwn}
          />
        )}

        {/* Reaction pills */}
        {message.reactions && message.reactions.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-1 mt-1",
              isOwn ? "justify-end" : "justify-start",
            )}
          >
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => onReact?.(message.id, r.emoji)}
                className={cn(
                  "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border transition-colors",
                  false
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted border-border hover:bg-muted/80 text-foreground",
                )}
              >
                <span>{r.emoji}</span>
                {/* <span className="font-medium">{r.count}</span> */}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp + status */}
        <div
          className={cn(
            "flex items-center gap-2 mt-1",
            isOwn && "flex-row-reverse",
          )}
        >
          {!showAvatar &&
            (isOwn ? (
              hovered && (
                <span className="text-[10px] text-muted-foreground">
                  {formatTime(message.createdAt)}
                </span>
              )
            ) : (
              <span
                className={cn(
                  "text-[10px] text-muted-foreground transition-opacity duration-200",
                  hovered ? "opacity-100" : "opacity-0",
                )}
              >
                {formatTime(message.createdAt)}
              </span>
            ))}
          {isOwn && <MessageStatusIcon status={message.status} />}
        </div>
      </div>

      {/* ── Hover toolbar ──────────────────────────────────────────────────
          Appears on message hover. Shows quick reactions inline when the
          thumbs-up is clicked, then Reply + More as usual.                */}
      <div
        className={cn(
          "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-2",
          isOwn && "flex-row-reverse",
        )}
      >
        {/* Quick reaction strip — expands inline when reactionsOpen */}
        {reactionsOpen && (
          <div
            className={cn(
              "flex items-center gap-0.5 mr-1",
              isOwn && "flex-row-reverse mr-0 ml-1",
            )}
          >
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact?.(message.id, emoji);
                  setReactionsOpen(false);
                }}
                className="p-1 rounded-md hover:bg-muted transition-colors text-sm leading-none"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Thumbs-up toggles the reaction strip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setReactionsOpen((o) => !o)}
                className={cn(
                  "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
                  reactionsOpen && "bg-muted text-foreground",
                )}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              React
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Reply — calls onReply so the parent can populate the input */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onReply?.(message)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Reply
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              More
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

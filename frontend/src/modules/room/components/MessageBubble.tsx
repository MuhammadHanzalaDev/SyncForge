"use client";

import { useState, useCallback, useRef } from "react";
import type { Message } from "@/modules/message/message.types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";
import { getInitials } from "../room.utils";
import { formatTime } from "@/shared/utils/date";
import MessageStatusIcon from "./MessageStatusIcon";
import MessageAttachmentsList from "./MessageAttachmentsList";
import useMessageReadObserver from "../../message/hooks/useMessageReadObserver";
import { usePersonalInfo } from "@/modules/user/user.query";
import MessageActions from "./MessageActions";
import MessageReplyPreview from "./MessageReplyPreview";

type MessageBubbleProps = {
  message: Message;
  showAvatar: boolean;
  roomId: string;
  onReply: (message: Message) => void;
  onReact: (messageId: string, emoji: string) => void;
  onScrollToMessage?: (messageId: string) => void;
  registerRef?: (id: string, el: HTMLDivElement | null) => void;
  isHighlighted?: boolean;
};

export default function MessageBubble({
  message,
  showAvatar,
  roomId,
  onReply,
  onReact,
  onScrollToMessage,
  registerRef,
  isHighlighted,
}: MessageBubbleProps) {
  const [hovered, setHovered] = useState(false);
  // Controls whether the quick-reaction strip is expanded in the toolbar.
  const [reactionsOpen, setReactionsOpen] = useState<boolean>(false);

  const hasAttachments =
    (message.attachments && message.attachments.length > 0) ||
    (message.tempAttachments && message.tempAttachments.length > 0);
  const hasText = message.content && message.content.trim().length > 0;

  const { data: personalInfo } = usePersonalInfo();
  const isOwn = message.sender.id === personalInfo?.id;

  const elementRef = useRef<HTMLDivElement>(null);
  useMessageReadObserver(
    elementRef,
    message.id,
    roomId,
    message.status,
    isOwn || false,
  );

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      elementRef.current = el;
      registerRef?.(message.id, el);
    },
    [registerRef, message.id],
  );

  return (
    <div
      className={cn(
        "flex gap-3 group px-4 py-1 hover:bg-muted/30 rounded-lg transition-colors duration-300",
        isOwn && "flex-row-reverse",
        isHighlighted && "bg-primary/10 ring-2 ring-primary/40",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setReactionsOpen(false);
      }}
      ref={setRefs}
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

        {/* Reply preview + text bubble */}
        {(message.parent || hasText) && (
          <div
            className={cn(
              "rounded-2xl overflow-hidden max-w-full",
              isOwn
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted text-foreground rounded-tl-sm",
            )}
          >
            {/* Reply preview — inside the bubble */}
            {message.parent && (
              <MessageReplyPreview
                parent={message.parent}
                isOwn={isOwn}
                currentUserId={personalInfo?.id}
                onClick={() => onScrollToMessage?.(message.parent!.id)}
              />
            )}

            {/* Text content */}
            {hasText && (
              <div className="px-3.5 py-2 text-sm leading-relaxed">
                {message.content}
              </div>
            )}
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

      <MessageActions
        message={message}
        isOwn={isOwn}
        reactionsOpen={reactionsOpen}
        setReactionsOpen={setReactionsOpen}
        onReply={onReply}
        onReact={onReact}
      />
    </div>
  );
}

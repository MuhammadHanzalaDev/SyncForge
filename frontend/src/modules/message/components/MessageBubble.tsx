"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import type {
  Message,
  QuickMessageReactions,
  AggregatedReaction,
} from "@/modules/message/message.types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";
import { getInitials } from "../../room/room.utils";
import { formatTime } from "@/shared/utils/date";
import MessageStatusIcon from "./MessageStatusIcon";
import MessageAttachmentsList from "./MessageAttachmentsList";
import useMessageReadObserver from "../hooks/useMessageReadObserver";
import { usePersonalInfo } from "@/modules/user/user.query";
import MessageActions from "./MessageActions";
import MessageReplyPreview from "./MessageReplyPreview";

type MessageBubbleProps = {
  message: Message;
  showAvatar: boolean;
  roomId: string;
  onReply: (message: Message) => void;
  onReact: (messageId: string, emoji: QuickMessageReactions) => void;
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

  const aggregatedReactions = useMemo(() => {
    if (!message.reactions?.length) return [];

    const map = new Map<QuickMessageReactions, AggregatedReaction>();

    for (const r of message.reactions) {
      const existing = map.get(r.emoji);
      if (existing) {
        existing.count += 1;
        existing.userIds.push(r.user.id);
        if (r.user.id === personalInfo?.id) existing.reactedByMe = true;
      } else {
        map.set(r.emoji, {
          emoji: r.emoji,
          count: 1,
          userIds: [r.user.id],
          reactedByMe: r.user.id === personalInfo?.id,
        });
      }
    }

    return Array.from(map.values());
  }, [message.reactions, personalInfo?.id]);

  const myEmojis = useMemo(
    () =>
      new Set(
        aggregatedReactions.filter((r) => r.reactedByMe).map((r) => r.emoji),
      ),
    [aggregatedReactions],
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
        {aggregatedReactions.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-1 mt-1",
              isOwn ? "justify-end" : "justify-start",
            )}
          >
            {aggregatedReactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => onReact?.(message.id, r.emoji)}
                className={cn(
                  "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border transition-colors",
                  r.reactedByMe
                    ? "bg-primary/10 border-primary text-primary hover:bg-primary/20"
                    : "bg-muted border-border hover:bg-muted/80 text-foreground",
                )}
                title={
                  r.reactedByMe
                    ? "Click to remove your reaction"
                    : "Click to react"
                }
              >
                <span>{r.emoji}</span>
                {r.count > 1 && <span className="font-medium">{r.count}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp + status */}
        {!showAvatar && (
          <div
            className={cn(
              "flex items-center gap-1 mt-0.5",
              isOwn ? "justify-end" : "justify-start",
            )}
          >
            <span
              className={cn(
                "text-[10px] text-muted-foreground transition-opacity duration-200",
                hovered ? "opacity-100" : "opacity-0",
              )}
            >
              {formatTime(message.createdAt)}
            </span>
            {isOwn && <MessageStatusIcon status={message.status} />}
          </div>
        )}
      </div>

      <MessageActions
        message={message}
        isOwn={isOwn}
        reactionsOpen={reactionsOpen}
        setReactionsOpen={setReactionsOpen}
        onReply={onReply}
        onReact={onReact}
        myEmojis={myEmojis}
      />
    </div>
  );
}

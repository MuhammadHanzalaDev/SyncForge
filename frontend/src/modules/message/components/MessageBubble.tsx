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
import ReactionPopover from "./ReactionPopover";

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
  const [reactionsOpen, setReactionsOpen] = useState<boolean>(false);

  const hasAttachments =
    (message.attachments && message.attachments.length > 0) ||
    (message.tempAttachments && message.tempAttachments.length > 0);
  const hasText = message.content && message.content.trim().length > 0;

  const { data: personalInfo } = usePersonalInfo();
  const isOwn = message.sender.id === personalInfo?.id;

  // true = first message in a group → gets the directional sharp corner
  const isFirstInGroup = showAvatar;

  const elementRef = useRef<HTMLDivElement>(null);
  useMessageReadObserver(
    elementRef,
    message,
    roomId,
    personalInfo?.id || "",
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
      const fullName = `${r.user.firstName} ${r.user.lastName}`;
      const existing = map.get(r.emoji);
      if (existing) {
        existing.count += 1;
        existing.userIds.push(r.user.id);
        existing.userNames.push(
          r.user.id === personalInfo?.id ? "You" : fullName,
        );
        if (r.user.id === personalInfo?.id) existing.reactedByMe = true;
      } else {
        map.set(r.emoji, {
          emoji: r.emoji,
          count: 1,
          userIds: [r.user.id],
          userNames: [r.user.id === personalInfo?.id ? "You" : fullName],
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

  // Bubble corner radius:
  // • First in group  → rounded-xl with one sharp (sender-side top) corner
  // • Subsequent      → rounded-md (subtle, not pill-like)
  const bubbleRadius = isOwn
    ? isFirstInGroup
      ? "rounded-xl rounded-tr-sm"
      : "rounded-md"
    : isFirstInGroup
      ? "rounded-xl rounded-tl-sm"
      : "rounded-md";

  // Meta node rendered inside text bubbles (floated right)
  const inlineMetaNode = (
    <span className="inline-flex items-center gap-1 ml-2 float-right self-end translate-y-[2px]">
      <span
        className={cn(
          "text-[10px] leading-none",
          isOwn ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {formatTime(message.createdAt)}
      </span>
      {isOwn && <MessageStatusIcon status={message.status} insideBubble />}
    </span>
  );

  // Meta node passed into attachment tiles — plain colors (outside bubble bg)
  const attachmentMetaNode = (
    <span className="inline-flex items-center gap-1">
      <span className="text-[10px] leading-none text-muted-foreground">
        {formatTime(message.createdAt)}
      </span>
      {isOwn && <MessageStatusIcon status={message.status} />}
    </span>
  );

  return (
    <div
      className={cn(
        "flex gap-3 group px-4 py-0.5 hover:bg-muted/30 rounded-lg transition-colors duration-300",
        isOwn && "flex-row-reverse",
        isHighlighted && "bg-primary/10 ring-2 ring-primary/40",
        showAvatar && "mt-3",
      )}
      onMouseEnter={() => setReactionsOpen(false)}
      ref={setRefs}
    >
      {/* Avatar column */}
      <div className="w-8 shrink-0 mt-1">
        {isFirstInGroup && !isOwn && (
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

      {/* Content column */}
      <div className={cn("flex flex-col max-w-[70%]", isOwn && "items-end")}>
        {/* Sender name (first message in group only) */}
        {isFirstInGroup && (
          <div
            className={cn(
              "flex items-baseline gap-2 mb-1",
              isOwn && "flex-row-reverse",
            )}
          >
            <span className="text-sm font-semibold text-foreground">
              {isOwn ? "You" : message.sender?.name}
            </span>
          </div>
        )}

        {/* Reply preview + text bubble */}
        {(message.parent || hasText) && (
          <div
            className={cn(
              "overflow-hidden max-w-full",
              bubbleRadius,
              isOwn
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground",
            )}
          >
            {message.parent && (
              <MessageReplyPreview
                parent={message.parent}
                isOwn={isOwn}
                currentUserId={personalInfo?.id}
                onClick={() => onScrollToMessage?.(message.parent!.id)}
              />
            )}

            {hasText && (
              <div className="px-3.5 py-2 text-sm leading-relaxed overflow-hidden">
                {inlineMetaNode}
                {message.content}
              </div>
            )}

            {/* reply-only bubble: no text, just show meta below the preview */}
            {!hasText && message.parent && (
              <div className="px-3.5 pb-2 flex justify-end">
                {inlineMetaNode}
              </div>
            )}
          </div>
        )}

        {/* Attachments — meta is embedded inside the tiles */}
        {hasAttachments && (
          <MessageAttachmentsList
            attachments={message.attachments}
            tempAttachments={message.tempAttachments}
            isOwn={isOwn}
            metaNode={
              !hasText && !message.parent ? attachmentMetaNode : undefined
            }
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
              <ReactionPopover
                key={r.emoji}
                reaction={r}
                isOwn={isOwn}
                onReact={(emoji) => onReact(message.id, emoji)}
              />
            ))}
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

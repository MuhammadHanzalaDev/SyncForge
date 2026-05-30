"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  Message,
  QuickMessageReactions,
} from "@/modules/message/message.types";
import { Loader2 } from "lucide-react";
import { formatDateDivider } from "@/shared/utils/date";
import { Separator } from "@/shared/components/ui/separator";
import MessageBubble from "./MessageBubble";
import ConversationStartHeader from "../../room/components/ConversationStartHeader";
import { InfiniteScrollContainer } from "@/shared/components";
import type { InfiniteScrollContainerHandle } from "@/shared/components/common/InfiniteScrollContainer";
import { useScrollBehavior } from "../../room/hooks/useScrollBehaviour";
import { Chat, Room } from "../../room/room.types";
import useUserStatusStore from "@/shared/store/userStatusStore";
import message from "@/shared/utils/toast";

type MessageListProps = {
  // Data
  messages: Message[];
  roomId: string | null;
  activeItem: Chat | Room | null;
  currentUserId?: string;
  hasUnreadBelow: boolean;
  setHasUnreadBelow: (val: boolean) => void;

  // Pagination
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  scrollRef: React.RefObject<InfiniteScrollContainerHandle | null>;

  // Reply integration — bubble triggers, ChatScreen owns the state
  onReply: (message: Message) => void;
  onReact: (messageId: string, emoji: QuickMessageReactions) => void;

  isRoom: boolean;
  isPersonalChat?: boolean;
  lastReadAt: Date | null;
};

export default function MessageList({
  messages,
  roomId,
  activeItem,
  currentUserId,
  hasUnreadBelow,
  setHasUnreadBelow,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  scrollRef,
  onReply,
  onReact,
  isRoom,
  isPersonalChat,
  lastReadAt,
}: MessageListProps) {
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const hasScrolledToUnread = useRef(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const getUserStatus = useUserStatusStore((state) => state.getUserStatus);
  const userStatus = getUserStatus(activeItem?.id || "");

  useScrollBehavior(messages, scrollRef, {
    onNewMessageWhileScrolledUp: () => setHasUnreadBelow(true),
    currentUserId,
    activeId: activeItem?.id || "",
  });

  const registerMessageRef = useCallback(
    (id: string, el: HTMLDivElement | null) => {
      if (el) messageRefs.current.set(id, el);
      else messageRefs.current.delete(id);
    },
    [],
  );

  const scrollToMessage = useCallback(
    (messageId: string, shouldHighlight = true) => {
      const el = messageRefs.current.get(messageId);

      if (!el) {
        // Parent not loaded — Scenario B fallback
        message.info("Message not loaded.");
        return;
      }

      el.scrollIntoView({
        behavior: shouldHighlight ? "smooth" : "auto",
        block: "center",
      });
      if (shouldHighlight) {
        setHighlightedId(messageId);

        // Clear highlight after animation
        setTimeout(() => setHighlightedId(null), 1500);
      }
    },
    [],
  );

  useEffect(() => {
    if (hasScrolledToUnread.current) return;

    if (!lastReadAt || messages.length === 0) return;

    const lastReadTime = new Date(lastReadAt);

    const firstUnreadMessage = messages.find(
      (m) =>
        new Date(m.createdAt) > lastReadTime && m.sender.id !== currentUserId,
    );

    if (!firstUnreadMessage) return;

    hasScrolledToUnread.current = true;

    requestAnimationFrame(() => {
      scrollToMessage(firstUnreadMessage.id, false);
    });
  }, [messages, lastReadAt, scrollToMessage]);

  return (
    <>
      <InfiniteScrollContainer
        ref={scrollRef}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        direction="top"
        className="flex-1 min-h-0"
      >
        {/* Loading indicator for older messages */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Conversation start header — only shown when no more messages to load */}
        {!hasNextPage && !isRoom && (
          <ConversationStartHeader
            activeChat={activeItem as Chat}
            userStatus={userStatus}
            isPersonalChat={isPersonalChat}
          />
        )}

        {/* Messages in natural order: oldest -> newest */}
        {messages.map((message, idx) => {
          const prevMessage = messages[idx - 1];

          const currDate = new Date(message.createdAt).toDateString();

          const prevDate = prevMessage
            ? new Date(prevMessage.createdAt).toDateString()
            : null;

          const showDateDivider = currDate !== prevDate;

          const isUnread = lastReadAt
            ? new Date(message.createdAt) > new Date(lastReadAt)
            : false;

          const wasPrevUnread =
            prevMessage && lastReadAt
              ? new Date(prevMessage.createdAt) > new Date(lastReadAt)
              : false;

          const isOwn = message.sender.id === currentUserId;

          const showLastReadAtDivider = isUnread && !wasPrevUnread && !isOwn;

          const showAvatar =
            !prevMessage ||
            prevMessage.sender.id !== message.sender.id ||
            showDateDivider;

          return (
            <div key={message.id}>
              {/* Date Divider */}
              {showDateDivider && (
                <div className="flex justify-center gap-3 px-4 py-3">
                  <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 shrink-0">
                    {formatDateDivider(message.createdAt)}
                  </span>
                </div>
              )}

              {showLastReadAtDivider && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Separator className="flex-1 bg-primary" />

                  <span className="text-[11px] font-medium font-semibold text-primary bg-background px-2 shrink-0">
                    Last Read
                  </span>

                  <Separator className="flex-1 bg-primary" />
                </div>
              )}

              <MessageBubble
                message={message}
                showAvatar={showAvatar}
                roomId={roomId || ""}
                onReply={onReply}
                onReact={onReact}
                onScrollToMessage={scrollToMessage}
                registerRef={registerMessageRef}
                isHighlighted={highlightedId === message.id}
              />
            </div>
          );
        })}
      </InfiniteScrollContainer>

      {hasUnreadBelow && (
        <div className="flex justify-center px-4 py-1 shrink-0">
          <button
            onClick={() => {
              scrollRef.current?.scrollToBottom("smooth");
              setHasUnreadBelow(false);
            }}
            className="text-xs bg-primary text-primary-foreground rounded-full px-3 py-1 shadow-sm hover:bg-primary/90"
          >
            ↓ New messages
          </button>
        </div>
      )}
    </>
  );
}

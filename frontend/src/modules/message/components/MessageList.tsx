"use client";

import { useState, useRef, useCallback } from "react";
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
import { Chat } from "../../room/room.types";
import useUserStatusStore from "@/shared/store/userStatusStore";
import message from "@/shared/utils/toast";

type MessageListProps = {
  // Data
  messages: Message[];
  roomId: string | null;
  activeChat: Chat | null;
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
};

export default function MessageList({
  messages,
  roomId,
  activeChat,
  currentUserId,
  hasUnreadBelow,
  setHasUnreadBelow,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  scrollRef,
  onReply,
  onReact,
}: MessageListProps) {
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const getUserStatus = useUserStatusStore((state) => state.getUserStatus);
  const userStatus = getUserStatus(activeChat?.id || "");

  useScrollBehavior(messages, scrollRef, {
    onNewMessageWhileScrolledUp: () => setHasUnreadBelow(true),
    currentUserId,
    activeId: activeChat?.id || "",
  });

  const registerMessageRef = useCallback(
    (id: string, el: HTMLDivElement | null) => {
      if (el) messageRefs.current.set(id, el);
      else messageRefs.current.delete(id);
    },
    [],
  );

  const scrollToMessage = useCallback((messageId: string) => {
    const el = messageRefs.current.get(messageId);

    if (!el) {
      // Parent not loaded — Scenario B fallback
      message.info("Message not loaded.");
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedId(messageId);

    // Clear highlight after animation
    setTimeout(() => setHighlightedId(null), 1500);
  }, []);

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
        {!hasNextPage && (
          <>
            <ConversationStartHeader
              activeChat={activeChat}
              userStatus={userStatus}
            />

            {/* Date divider for first message */}
            {messages[0] && (
              <div className="flex items-center gap-3 px-4 py-2">
                <Separator className="flex-1" />
                <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 shrink-0">
                  {formatDateDivider(messages[0].createdAt)}
                </span>
                <Separator className="flex-1" />
              </div>
            )}
          </>
        )}

        {/* Messages in natural order: oldest -> newest */}
        {messages.map((message, idx) => {
          const prevMessage = messages[idx - 1];
          const currTime = new Date(message.createdAt).getTime();
          const prevTime = prevMessage
            ? new Date(prevMessage.createdAt).getTime()
            : 0;

          const showAvatar =
            !prevMessage ||
            prevMessage.sender.id !== message.sender.id ||
            currTime - prevTime > 1000 * 60 * 5;

          return (
            <MessageBubble
              key={message?.id}
              message={message}
              showAvatar={showAvatar}
              roomId={roomId || ""}
              onReply={onReply}
              onReact={onReact}
              onScrollToMessage={scrollToMessage}
              registerRef={registerMessageRef}
              isHighlighted={highlightedId === message.id}
            />
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

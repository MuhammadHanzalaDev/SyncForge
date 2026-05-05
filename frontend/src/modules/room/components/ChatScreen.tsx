"use client";

import { useState, useRef, useMemo } from "react";
import type { Message } from "@/modules/message/message.types";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import useRoomStore from "../room.store";
import useTypingSocket from "@/modules/message/hooks/useTypingSocket";
import { useMessages } from "@/modules/message/message.query";
import type { InfiniteScrollContainerHandle } from "@/shared/components/common/InfiniteScrollContainer";
import { usePersonalInfo } from "@/modules/user/user.query";

export default function ChatScreen() {
  // refs
  const scrollRef = useRef<InfiniteScrollContainerHandle>(null);

  // local states
  const [hasUnreadBelow, setHasUnreadBelow] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  // global client states
  const activeChat = useRoomStore((state) => state.activeChat);
  const roomId = useRoomStore((state) => state.roomId);

  // server states
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(roomId);
  const { data: personalInfo } = usePersonalInfo();

  const messages: Message[] = useMemo(() => {
    const flat = data?.pages.flatMap((p) => p.data) || [];
    return [...flat].reverse();
  }, [data?.pages]);

  // hooks
  const { typingUsers } = useTypingSocket(roomId);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable area — contains header + messages */}
      <MessageList
        messages={messages}
        roomId={roomId}
        activeChat={activeChat}
        currentUserId={personalInfo?.id}
        hasUnreadBelow={hasUnreadBelow}
        setHasUnreadBelow={setHasUnreadBelow}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        onReply={setReplyingTo}
        scrollRef={scrollRef}
      />

      {/* Typing indicator */}
      {typingUsers?.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-1">
          <div className="w-8" />
          <div className="flex items-center gap-1.5 bg-muted rounded-2xl px-3.5 py-2.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <MessageInput
        roomId={roomId}
        activeChat={activeChat}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        onSent={() => {
          scrollRef.current?.scrollToBottom("smooth");
          setHasUnreadBelow(false);
        }}
      />
    </div>
  );
}

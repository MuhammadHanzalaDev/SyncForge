"use client";

import { useState, useRef, useMemo } from "react";
import type {
  Message,
  QuickMessageReactions,
} from "@/modules/message/message.types";
import MessageInput from "../../message/components/MessageInput";
import MessageList from "../../message/components/MessageList";
import useRoomStore from "../room.store";
import useTypingSocket from "@/modules/message/hooks/useTypingSocket";
import { useMessages } from "@/modules/message/message.query";
import type { InfiniteScrollContainerHandle } from "@/shared/components/common/InfiniteScrollContainer";
import { usePersonalInfo } from "@/modules/user/user.query";
import { useReactMessage } from "@/modules/message/message.mutation";

export default function ChatScreen() {
  // refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  // mutations
  const { mutate: mutateReact } = useReactMessage();

  const messages: Message[] = useMemo(() => {
    const flat = data?.pages.flatMap((p) => p.data) || [];
    return [...flat].reverse();
  }, [data?.pages]);

  const isPersonalChat = personalInfo?.id === activeChat?.id;

  // hooks
  const { typingUsers, handleTypingStop } = useTypingSocket(roomId);

  // local functions
  const handleReply = (message: Message) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleReact = (messageId: string, emoji: QuickMessageReactions) => {
    if (!roomId) return;
    const data = {
      messageId,
      emoji,
      roomId: roomId,
      user: {
        id: personalInfo?.id || "",
        firstName: personalInfo?.firstName || "",
        lastName: personalInfo?.lastName || "",
      },
    };
    mutateReact(data);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable area — contains header + messages */}
      <MessageList
        messages={messages}
        roomId={roomId}
        activeItem={activeChat}
        currentUserId={personalInfo?.id}
        hasUnreadBelow={hasUnreadBelow}
        setHasUnreadBelow={setHasUnreadBelow}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        onReply={handleReply}
        onReact={handleReact}
        scrollRef={scrollRef}
        isRoom={false}
        isPersonalChat={isPersonalChat}
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
        activeItem={activeChat}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        onSent={() => {
          scrollRef.current?.scrollToBottom("smooth");
          setHasUnreadBelow(false);
        }}
        inputRef={inputRef}
        handleTypingStop={handleTypingStop}
        isRoom={false}
      />
    </div>
  );
}

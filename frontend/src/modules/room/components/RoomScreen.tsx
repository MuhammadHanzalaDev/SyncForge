"use client";

import { useState, useRef, useMemo, useEffect } from "react";
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
import TypingIndicator from "./TypingIndicator";

export default function RoomScreen() {
  // refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<InfiniteScrollContainerHandle>(null);
  const initialLastReadRef = useRef<string | null>(null);

  // local states
  const [hasUnreadBelow, setHasUnreadBelow] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [, forceRender] = useState(0);

  // global client states
  const activeRoom = useRoomStore((state) => state.activeRoom);
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

  useEffect(() => {
    if (
      initialLastReadRef.current === null &&
      data?.pages[0]?.lastReadMessageId
    ) {
      console.log("pages", data.pages);
      initialLastReadRef.current = data.pages[0].lastReadMessageId;
      forceRender((x) => x + 1);
    }
  }, [data]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable area — contains header + messages */}
      <MessageList
        messages={messages}
        roomId={roomId}
        activeItem={activeRoom}
        currentUserId={personalInfo?.id}
        hasUnreadBelow={hasUnreadBelow}
        setHasUnreadBelow={setHasUnreadBelow}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        onReply={handleReply}
        onReact={handleReact}
        scrollRef={scrollRef}
        isRoom={true}
        lastReadMessageId={initialLastReadRef.current}
      />

      {/* Typing indicator */}
      <TypingIndicator
        typingUserIds={typingUsers}
        members={activeRoom?.members}
        isDirect={false}
      />

      {/* Input Area */}
      <MessageInput
        roomId={roomId}
        activeItem={activeRoom}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        onSent={() => {
          scrollRef.current?.scrollToBottom("smooth");
          setHasUnreadBelow(false);
        }}
        inputRef={inputRef}
        handleTypingStop={handleTypingStop}
        isRoom={true}
      />
    </div>
  );
}

import { useEffect, useRef } from "react";
import type { InfiniteScrollContainerHandle } from "@/shared/components/common/InfiniteScrollContainer";
import type { Message, TypingData } from "@/modules/message/message.types";

export function useScrollBehavior(
  messages: Message[],
  typingUsers: TypingData[],
  scrollRef: React.RefObject<InfiniteScrollContainerHandle | null>,
) {
  const prevMessageCountRef = useRef<number>(0);
  const prevFirstMessageIdRef = useRef<string | undefined>(undefined);

  // Scroll to bottom on new messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const firstMessage = messages[0];

    if (!lastMessage) {
      prevMessageCountRef.current = messages.length;
      return;
    }

    const countChanged = messages.length !== prevMessageCountRef.current;
    const firstMessageChanged =
      prevFirstMessageIdRef.current !== undefined &&
      firstMessage?.id !== prevFirstMessageIdRef.current;

    if (countChanged && !firstMessageChanged) {
      scrollRef.current?.scrollToBottom(
        prevMessageCountRef.current === 0 ? "auto" : "smooth",
      );
    }

    prevMessageCountRef.current = messages.length;
    prevFirstMessageIdRef.current = firstMessage?.id;
  }, [messages]);

  // Scroll to bottom when someone starts typing
  useEffect(() => {
    if (typingUsers?.length > 0) {
      scrollRef.current?.scrollToBottom("smooth");
    }
  }, [typingUsers]);
}

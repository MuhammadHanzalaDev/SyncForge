import { useEffect, useRef } from "react";
import type { InfiniteScrollContainerHandle } from "@/shared/components/common/InfiniteScrollContainer";
import type { Message } from "@/modules/message/message.types";

type Options = {
  onNewMessageWhileScrolledUp?: () => void;
};

export function useScrollBehavior(
  messages: Message[],
  scrollRef: React.RefObject<InfiniteScrollContainerHandle | null>,
  options: Options = {},
) {
  const prevMessageCountRef = useRef<number>(0);
  const prevLastMessageIdRef = useRef<string | undefined>(undefined);
  const prevFirstMessageIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const firstMessage = messages[0];

    if (!lastMessage) {
      prevMessageCountRef.current = messages.length;
      return;
    }

    const isFirstRunWithMessages =
      prevLastMessageIdRef.current === undefined && messages.length > 0;

    // Container already scrolled to bottom on mount — just record state and exit
    if (isFirstRunWithMessages) {
      prevMessageCountRef.current = messages.length;
      prevLastMessageIdRef.current = lastMessage.id;
      prevFirstMessageIdRef.current = firstMessage?.id;
      return;
    }

    const lastMessageChanged = lastMessage.id !== prevLastMessageIdRef.current;
    const firstMessageChanged =
      firstMessage?.id !== prevFirstMessageIdRef.current;
    const countGrew = messages.length > prevMessageCountRef.current;

    // New message at the bottom (not pagination prepending older ones)
    const isNewMessageAtBottom =
      lastMessageChanged && !firstMessageChanged && countGrew;

    if (isNewMessageAtBottom) {
      const nearBottom = scrollRef.current?.isNearBottom(150) ?? true;
      if (nearBottom) {
        scrollRef.current?.scrollToBottom("smooth");
      } else {
        options.onNewMessageWhileScrolledUp?.();
      }
    }

    prevMessageCountRef.current = messages.length;
    prevLastMessageIdRef.current = lastMessage.id;
    prevFirstMessageIdRef.current = firstMessage?.id;
  }, [messages, options, scrollRef]);
}

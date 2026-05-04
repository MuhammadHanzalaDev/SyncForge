import { useEffect, useRef } from "react";
import type { InfiniteScrollContainerHandle } from "@/shared/components/common/InfiniteScrollContainer";
import type { Message } from "@/modules/message/message.types";

type Options = {
  onNewMessageWhileScrolledUp?: () => void;
  currentUserId?: string;
};

export function useScrollBehavior(
  messages: Message[],
  scrollRef: React.RefObject<InfiniteScrollContainerHandle | null>,
  options: Options,
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

    if (isFirstRunWithMessages) {
      scrollRef.current?.scrollToBottom("auto"); // Scroll to bottom on mount

      prevMessageCountRef.current = messages.length;
      prevLastMessageIdRef.current = lastMessage.id;
      prevFirstMessageIdRef.current = firstMessage?.id;
      return;
    }

    const isNewMessageAtBottom =
      lastMessage.id !== prevLastMessageIdRef.current;

    if (isNewMessageAtBottom) {
      const isOwnMessage = lastMessage.sender.id === options.currentUserId;
      if (isOwnMessage) {
        // Always scroll to own messages, no badge
        requestAnimationFrame(() => {
          scrollRef.current?.scrollToBottom("auto");
        });
      } else {
        const nearBottom = scrollRef.current?.isNearBottom(150);
        if (nearBottom === undefined) return;
        if (nearBottom) {
          requestAnimationFrame(() => {
            scrollRef.current?.scrollToBottom("auto");
          });
        } else {
          options.onNewMessageWhileScrolledUp?.();
        }
      }
    }

    prevMessageCountRef.current = messages.length;
    prevLastMessageIdRef.current = lastMessage.id;
    prevFirstMessageIdRef.current = firstMessage?.id;
  }, [messages, options, scrollRef]);

  // useEffect(() => {
  //   prevMessageCountRef.current = 0;
  //   prevLastMessageIdRef.current = undefined;
  //   prevFirstMessageIdRef.current = undefined;
  // }, [roomId]);
}

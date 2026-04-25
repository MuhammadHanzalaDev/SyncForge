import { useEffect, useRef } from "react";
import { MessageStatus } from "@/modules/message/message.types";

const useMessageReadObserver = (
  messageId: string,
  status: MessageStatus,
  isOwn: boolean,
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't track your own messages
    if (isOwn || status === "READ") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Fire your read event here
          markMessageAsRead(messageId);
          observer.disconnect(); // only need to fire once
        }
      },
      { threshold: 0.5 }, // 50% of message must be visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [messageId, status, isOwn]);

  return ref;
};

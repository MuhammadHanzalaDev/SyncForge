import { useEffect, useRef } from "react";
import { MessageStatus } from "@/modules/message/message.types";
import { useReadMessage } from "../message.mutation";
import { markRoomAsRead } from "../message.cache";
import { useQueryClient } from "@tanstack/react-query";

const useMessageReadObserver = (
  messageId: string,
  roomId: string,
  status: MessageStatus,
  isOwn: boolean,
) => {
  const queryClient = useQueryClient();
  const { mutate: markMessageAsRead } = useReadMessage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't track your own messages
    if (isOwn || status === "READ") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markMessageAsRead({ messageId, roomId });
          markRoomAsRead(queryClient, roomId);
          observer.disconnect(); // only need to fire once
        }
      },
      { threshold: 0.5 }, // 50% of message must be visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [messageId, roomId, status, isOwn, markMessageAsRead]);

  return ref;
};

export default useMessageReadObserver;

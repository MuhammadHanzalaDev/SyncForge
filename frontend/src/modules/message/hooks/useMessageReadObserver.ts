import { useEffect } from "react";
import { MessageStatus } from "@/modules/message/message.types";
import { useReadMessage } from "../message.mutation";

const useMessageReadObserver = (
  ref: React.RefObject<HTMLDivElement | null>,
  messageId: string,
  roomId: string,
  status: MessageStatus,
  isOwn: boolean,
) => {
  const { mutate: markMessageAsRead } = useReadMessage();

  useEffect(() => {
    if (isOwn || status === "READ") return;
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markMessageAsRead({ messageId, roomId });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, messageId, roomId, status, isOwn, markMessageAsRead]);
};

export default useMessageReadObserver;

import { useEffect } from "react";
import { Message } from "@/modules/message/message.types";
import { useReadMessage } from "../message.mutation";

const useMessageReadObserver = (
  ref: React.RefObject<HTMLDivElement | null>,
  message: Message,
  roomId: string,
  userId: string,
  isOwn: boolean,
) => {
  const { mutate: markMessageAsRead } = useReadMessage();

  useEffect(() => {
    if (isOwn) return;

    const isReadByMe =
      message.receipts.find((r) => r.userId === userId)?.status === "READ";

    if (isReadByMe) return;

    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isReadByMe) {
          console.log("reading message:", message);
          markMessageAsRead({
            messageId: message.id,
            messageCreatedAt: message.createdAt,
            roomId,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [
    ref,
    roomId,
    message.createdAt,
    message.id,
    message.status,
    isOwn,
    markMessageAsRead,
  ]);
};

export default useMessageReadObserver;

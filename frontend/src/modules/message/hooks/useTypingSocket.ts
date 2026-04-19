import { useState, useRef } from "react";
import useSocketEvent from "@/shared/hooks/useSocketEvent";
import useSocketEmit from "@/shared/hooks/useSocketEmit";
import { TypingData } from "../message.types";

export default function useTypingSocket(roomId: string | null) {
  const emit = useSocketEmit();

  // typing states
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingData[]>([]);

  function handleTyping() {
    if (!isTyping) {
      emit("typing:start", { roomId });
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emit("typing:stop", { roomId });
      setIsTyping(false);
    }, 1000); // stop after 1s of inactivity
  }

  // events
  useSocketEvent("typing:start", ({ userId }) => {
    setTypingUsers((prev) => [...new Set([...prev, userId])]);
  });

  useSocketEvent("typing:stop", ({ userId }) => {
    setTypingUsers((prev) => prev.filter((id) => id !== userId));
  });

  return { handleTyping, typingUsers };
}

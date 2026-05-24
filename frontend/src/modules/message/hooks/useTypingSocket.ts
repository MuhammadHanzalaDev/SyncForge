import { useState, useRef } from "react";
import useSocketEvent from "@/shared/hooks/useSocketEvent";
import useSocketEmit from "@/shared/hooks/useSocketEmit";

export default function useTypingSocket(roomId: string | null) {
  const emit = useSocketEmit();

  // typing states
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  function handleTyping() {
    if (!isTyping) {
      emit("typing:start", { roomId });
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 2000); // stop after 1s of inactivity
  }

  function handleTypingStop() {
    emit("typing:stop", { roomId });
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }

  // events
  useSocketEvent("typing:start", (data) => {
    console.log("start", data);
    setTypingUsers((prev) => [...new Set([...prev, data.userId])]);
  });

  useSocketEvent("typing:stop", (data) => {
    console.log("stop", data);
    setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
  });

  return { handleTyping, handleTypingStop, typingUsers };
}

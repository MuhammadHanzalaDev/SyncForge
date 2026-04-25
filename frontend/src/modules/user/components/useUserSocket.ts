import { useState } from "react";
import useSocketEvent from "@/shared/hooks/useSocketEvent";

export default function useUserSocket() {
  // state
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // events
  useSocketEvent("user:online-list", ({ users }) => {
    setOnlineUsers(users);
  });
  useSocketEvent("user:online", ({ userId }) => {
    setOnlineUsers((prev) => [...new Set([...prev, userId])]);
  });
  useSocketEvent("user:offline", ({ userId }) => {
    setOnlineUsers((prev) => prev.filter((id) => id !== userId));
  });

  return { onlineUsers };
}

// hooks/useSocket.ts
import { useEffect } from "react";
import { useSocketStore } from "../store/socketStore";

function useSocketEvent(event: string, handler: (...args: any[]) => void) {
  const socket = useSocketStore((s) => s.socket);

  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}

export default useSocketEvent;

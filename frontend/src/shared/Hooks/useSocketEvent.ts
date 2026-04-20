// hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { useSocketStore } from "../store/socketStore";

function useSocketEvent(event: string, handler: (...args: any[]) => void) {
  const socket = useSocketStore((s) => s.socket);

  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) return;

    const eventHandler = (...args: any[]) => {
      handlerRef.current(...args);
    };

    socket.on(event, eventHandler);

    return () => {
      socket.off(event, eventHandler);
    };
  }, [socket, event]);
}

export default useSocketEvent;

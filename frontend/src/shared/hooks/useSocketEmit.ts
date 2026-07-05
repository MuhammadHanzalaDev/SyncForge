import { useCallback } from "react";
import { useSocketStore } from "../store/socketStore";

function useSocketEmit() {
  const { socket } = useSocketStore();

  const emit = useCallback(
    (event: string, data?: any) => {
      if (!socket) return;
      socket.emit(event, data);
    },
    [socket],
  );
  return emit;
}

export default useSocketEmit;

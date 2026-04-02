import useSocketEmit from "@/shared/hooks/useSocketEmit";
import { useEffect } from "react";

export default function useRoomSocket() {
  const emit = useSocketEmit();

  useEffect(() => {
    if (!emit) return;

    const roomId = "hello my id is here 4sdifdf";

    emit("room:join", { roomId });

    return () => {
      emit("room:leave", { roomId });
    };
  }, [emit]);
}

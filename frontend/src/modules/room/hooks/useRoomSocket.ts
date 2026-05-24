import { useEffect, useCallback, useRef } from "react";
import useSocketEmit from "@/shared/hooks/useSocketEmit";
import useSocketEvent from "@/shared/hooks/useSocketEvent";
import useWorkspaceStore from "@/modules/workspace/workspace.store";
import useRoomStore from "@/modules/room/room.store";

export default function useRoomSocket(targetRoomId: string) {
  const { workspaceId } = useWorkspaceStore();
  const { roomId, setRoomId } = useRoomStore();
  const emit = useSocketEmit();

  const roomIdRef = useRef(roomId);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const handleJoined = useCallback(
    (data: { roomId: string }) => {
      console.log("Room joined:", data.roomId);
      setRoomId(data.roomId);
    },
    [setRoomId],
  );

  // events
  useSocketEvent("room:joined", handleJoined);

  // auto emits
  useEffect(() => {
    if (!emit || !workspaceId || !targetRoomId) return;

    emit("room:join", { roomId: targetRoomId, workspaceId });

    return () => {
      if (roomIdRef.current) {
        emit("room:leave", roomIdRef.current);
      }
    };
  }, [emit, workspaceId, targetRoomId]);
}

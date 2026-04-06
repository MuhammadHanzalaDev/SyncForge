import { useEffect, useCallback, useRef } from "react";
import useSocketEmit from "@/shared/hooks/useSocketEmit";
import useSocketEvent from "@/shared/hooks/useSocketEvent";
import useWorkspaceStore from "@/modules/workspace/workspace.store";
import useRoomStore from "@/modules/room/room.store";

export default function useChatSocket(targetUserId: string) {
  const { workspaceId } = useWorkspaceStore();
  const { roomId, setRoomId } = useRoomStore();
  const emit = useSocketEmit();

  const roomIdRef = useRef(roomId);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const handleJoined = useCallback(
    (data: { roomId: string }) => {
      console.log("Direct room joined:", data.roomId);
      setRoomId(data.roomId);
    },
    [setRoomId],
  );

  // events
  useSocketEvent("room:direct-joined", handleJoined);

  // auto emits
  useEffect(() => {
    if (!emit || !workspaceId || !targetUserId) return;

    emit("room:direct-join", { targetUserId, workspaceId });

    return () => {
      if (roomIdRef.current) {
        emit("room:leave", roomIdRef.current);
      }
    };
  }, [emit, workspaceId, targetUserId]);
}

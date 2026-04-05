import { useEffect, useCallback } from "react";
import useSocketEmit from "@/shared/hooks/useSocketEmit";
import useSocketEvent from "@/shared/hooks/useSocketEvent";
import useWorkspaceStore from "@/modules/workspace/workspace.store";
import useRoomStore from "@/modules/room/room.store";

export default function useChatSocket(targetUserId: string) {
  const { workspaceId } = useWorkspaceStore();
  const { roomId, setRoomId } = useRoomStore();
  const emit = useSocketEmit();

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
      if (roomId) {
        emit("room:leave", roomId);
      }
    };
  }, [emit, workspaceId, targetUserId, roomId]);
}

import { useRef, useCallback } from "react";
import { useWebRTC } from "./useWebRTC";
import useCallStore from "../call.store";
import { v4 as uuid } from "uuid";
import useSocketEmit from "@/shared/hooks/useSocketEmit";
import useSocketEvent from "@/shared/hooks/useSocketEvent";

const RING_TIMEOUT_MS = 30_000;

export function useCallSignaling(currentUserId: string) {
  const emit = useSocketEmit();
  const webrtc = useWebRTC();
  const store = useCallStore();
  const ringTimerRef = useRef<NodeJS.Timeout | null>(null);

  const emitSignal = useCallback(
    (event: string, data: unknown) => {
      const { callId, peerUserId } = useCallStore.getState();
      emit(event, { callId, toUserId: peerUserId, data });
    },
    [emit],
  );

  // ---- CALLER: start a call ----
  const startCall = useCallback(
    async (roomId: string, peerUserId: string, type: "AUDIO" | "VIDEO") => {
      console.log("startCall FIRED");
      const callId = uuid();
      try {
        store.setOutgoing({ callId, roomId, peerUserId, type });
        webrtc.createPeerConnection((candidate) =>
          emit("call:ice-candidate", {
            callId,
            toUserId: peerUserId,
            data: candidate,
          }),
        );
        await webrtc.getLocalMedia(type === "VIDEO");
        emit("call:invite", { callId, roomId, toUserId: peerUserId, type });
        ringTimerRef.current = setTimeout(() => {
          emit("call:hangup", { callId, toUserId: peerUserId });
          webrtc.cleanup();
          store.reset();
        }, RING_TIMEOUT_MS);
      } catch (err) {
        console.error("startCall failed:", err); // ← this will tell you everything
        webrtc.cleanup();
        store.reset();
      }
    },
    [webrtc, store, emit],
  );

  // ---- CALLEE: accept ----
  const acceptCall = useCallback(async () => {
    const { incoming } = useCallStore.getState();
    if (!incoming) return;
    store.setStatus("connecting");

    webrtc.createPeerConnection((candidate) =>
      emit("call:ice-candidate", {
        callId: incoming.callId,
        toUserId: incoming.from,
        data: candidate,
      }),
    );
    await webrtc.getLocalMedia(incoming.type === "VIDEO");

    emit("call:accept", { callId: incoming.callId, toUserId: incoming.from });
  }, [webrtc, store, emit]);

  // ---- CALLEE: reject ----
  const rejectCall = useCallback(() => {
    const { incoming } = useCallStore.getState();
    if (!incoming) return;
    emit("call:reject", { callId: incoming.callId, toUserId: incoming.from });
    store.reset();
  }, [store, emit]);

  // ---- Either side: hang up ----
  const hangup = useCallback(() => {
    const { callId, peerUserId } = useCallStore.getState();
    if (callId && peerUserId) {
      emit("call:hangup", { callId, toUserId: peerUserId });
    }
    webrtc.cleanup();
    store.reset();
  }, [webrtc, store, emit]);

  // ---- Socket listeners (one per event, via your hook) ----

  useSocketEvent("call:incoming", (p: any) => {
    // busy: already in a call -> auto-reject
    if (useCallStore.getState().status !== "idle") {
      emit("call:reject", { callId: p.callId, toUserId: p.from });
      return;
    }
    store.setIncoming(p);
  });

  // caller side: callee accepted -> NOW send the offer
  useSocketEvent("call:accepted", async () => {
    if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
    store.setStatus("connecting");
    const offer = await webrtc.createOffer();
    emitSignal("call:offer", offer);
  });

  // callee side: received the offer -> answer it
  useSocketEvent("call:offer", async (p: any) => {
    const answer = await webrtc.createAnswer(p.data);
    emitSignal("call:answer", answer);
    store.setStatus("active");
  });

  // caller side: got the answer -> connection completes
  useSocketEvent("call:answer", async (p: any) => {
    await webrtc.acceptAnswer(p.data);
    store.setStatus("active");
  });

  // both sides: trickle ICE
  useSocketEvent("call:ice-candidate", async (p: any) => {
    await webrtc.addIceCandidate(p.data);
  });

  useSocketEvent("call:rejected", () => {
    if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
    webrtc.cleanup();
    store.reset();
  });

  useSocketEvent("call:hangup", () => {
    webrtc.cleanup();
    store.reset();
  });

  return {
    webrtc,
    startCall,
    acceptCall,
    rejectCall,
    hangup,
    toggleAudio: () => store.setMuted(!webrtc.toggleAudio()),
    toggleVideo: () => store.setVideoOff(!webrtc.toggleVideo()),
    startScreenShare: webrtc.startScreenShare,
  };
}

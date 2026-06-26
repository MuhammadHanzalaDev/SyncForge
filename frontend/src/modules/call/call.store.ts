import { create } from "zustand";
import { CallStatus, IncomingCall } from "./call.types";

type StartCallFn = (
  roomId: string,
  peerUserId: string,
  type: "AUDIO" | "VIDEO",
) => void;

interface CallState {
  status: CallStatus;
  callId: string | null;
  roomId: string | null;
  peerUserId: string | null;
  callType: "AUDIO" | "VIDEO";
  incoming: IncomingCall | null;
  isMuted: boolean;
  isVideoOff: boolean;

  // the real startCall, registered by CallProvider on mount
  startCall: StartCallFn | null;

  // actions
  setOutgoing: (p: {
    callId: string;
    roomId: string;
    peerUserId: string;
    type: "AUDIO" | "VIDEO";
  }) => void;
  setIncoming: (p: IncomingCall) => void;
  setStatus: (s: CallStatus) => void;
  setMuted: (m: boolean) => void;
  setVideoOff: (v: boolean) => void;
  registerStartCall: (fn: StartCallFn) => void;
  reset: () => void;
}

const initial = {
  status: "idle" as CallStatus,
  callId: null,
  roomId: null,
  peerUserId: null,
  callType: "VIDEO" as const,
  incoming: null,
  isMuted: false,
  isVideoOff: false,
};

const useCallStore = create<CallState>((set) => ({
  ...initial,
  startCall: null,

  setOutgoing: ({ callId, roomId, peerUserId, type }) =>
    set({
      status: "ringing",
      callId,
      roomId,
      peerUserId,
      callType: type,
      incoming: null,
    }),

  setIncoming: (incoming) =>
    set({
      status: "incoming",
      incoming,
      callId: incoming.callId,
      roomId: incoming.roomId,
      peerUserId: incoming.from,
      callType: incoming.type,
    }),

  setStatus: (status) => set({ status }),
  setMuted: (isMuted) => set({ isMuted }),
  setVideoOff: (isVideoOff) => set({ isVideoOff }),
  registerStartCall: (fn) => set({ startCall: fn }),

  reset: () => set(initial),
}));

export default useCallStore;

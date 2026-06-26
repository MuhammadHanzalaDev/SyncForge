type CallStatus = "idle" | "ringing" | "incoming" | "connecting" | "active";

interface IncomingCall {
  callId: string;
  roomId: string;
  from: string;
  type: "AUDIO" | "VIDEO";
}

export type { CallStatus, IncomingCall };

export type CallType = "AUDIO" | "VIDEO";

export interface CallInvitePayload {
  callId: string;
  roomId: string;
  toUserId: string;
  type: CallType;
}

export interface SignalPayload {
  callId: string;
  toUserId: string;
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
}

export interface CallActionPayload {
  callId: string;
  toUserId: string;
}

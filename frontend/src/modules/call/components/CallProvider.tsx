"use client";
import { useEffect } from "react";
import { useCallSignaling } from "../hooks/useCallSignaling";
import useCallStore from "../call.store";
import { CallModal } from "./CallModal";
import { IncomingCallModal } from "./IncomingCallModal";

export function CallProvider({ currentUserId }: { currentUserId: string }) {
  console.log("CallProvider mounted");
  const call = useCallSignaling(currentUserId);
  const registerStartCall = useCallStore((s) => s.registerStartCall);

  useEffect(() => {
    registerStartCall(call.startCall);
    console.log("startCall registered");
  }, [registerStartCall]);

  return (
    <>
      <IncomingCallModal
        callerName={"Caller"} // resolve real name from your user store via peerUserId
        onAccept={call.acceptCall}
        onReject={call.rejectCall}
      />
      <CallModal
        localStream={call.webrtc.localStream}
        remoteStream={call.webrtc.remoteStream}
        peerName={"Peer"} // same — resolve from peerUserId
        onHangup={call.hangup}
        onToggleAudio={call.toggleAudio}
        onToggleVideo={call.toggleVideo}
        onScreenShare={call.startScreenShare}
      />
    </>
  );
}

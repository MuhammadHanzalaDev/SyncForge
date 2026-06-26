import { useRef, useCallback, useState } from "react";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // TURN goes here later when you self-host coturn:
    // { urls: 'turn:your-vm-ip:3478', username: 'x', credential: 'y' },
  ],
};

export function useWebRTC() {
  // RTCPeerConnection lives in a ref — NEVER in state.
  // It must survive re-renders untouched. This is the #1 rule.
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Caller passes a function to send signals out over socket.
  // The hook stays transport-agnostic — clean separation.
  const createPeerConnection = useCallback(
    (onIceCandidate: (c: RTCIceCandidateInit) => void) => {
      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Trickle ICE: fire each candidate up to signaling as it's found
      pc.onicecandidate = (event) => {
        if (event.candidate) onIceCandidate(event.candidate.toJSON());
      };

      // Remote media arrives here
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      // Connection health — handle drops
      pc.oniceconnectionstatechange = () => {
        if (
          pc.iceConnectionState === "failed" ||
          pc.iceConnectionState === "disconnected"
        ) {
          // surface this to UI so user sees "reconnecting / call dropped"
          console.warn("ICE state:", pc.iceConnectionState);
        }
      };

      pcRef.current = pc;
      return pc;
    },
    [],
  );

  // Grab camera/mic and attach tracks to the connection
  const getLocalMedia = useCallback(async (video: boolean) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video,
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    stream.getTracks().forEach((track) => {
      pcRef.current?.addTrack(track, stream);
    });
    return stream;
  }, []);

  // CALLER side
  const createOffer = useCallback(async () => {
    const pc = pcRef.current!;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer; // send this over socket as call:offer
  }, []);

  // CALLEE side
  const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    const pc = pcRef.current!;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer; // send this over socket as call:answer
  }, []);

  // CALLER receives the answer
  const acceptAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit) => {
      await pcRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    },
    [],
  );

  // Both sides feed incoming ICE candidates in
  const addIceCandidate = useCallback(
    async (candidate: RTCIceCandidateInit) => {
      try {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        // candidates can arrive before remoteDescription is set — buffer if needed
        console.warn("addIceCandidate failed", e);
      }
    },
    [],
  );

  // Mute / camera toggle — just enable/disable tracks
  const toggleAudio = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = !track.enabled;
    return track?.enabled;
  }, []);

  const toggleVideo = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) track.enabled = !track.enabled;
    return track?.enabled;
  }, []);

  // Screen share — replace the video track being sent
  const startScreenShare = useCallback(async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    const screenTrack = screenStream.getVideoTracks()[0];
    const sender = pcRef.current
      ?.getSenders()
      .find((s) => s.track?.kind === "video");
    await sender?.replaceTrack(screenTrack);
    // when user stops sharing, swap camera back
    screenTrack.onended = () => {
      const camTrack = localStreamRef.current?.getVideoTracks()[0];
      if (camTrack) sender?.replaceTrack(camTrack);
    };
  }, []);

  // CRITICAL cleanup — stop tracks or the camera light stays on
  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  return {
    localStream,
    remoteStream,
    createPeerConnection,
    getLocalMedia,
    createOffer,
    createAnswer,
    acceptAnswer,
    addIceCandidate,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    cleanup,
  };
}

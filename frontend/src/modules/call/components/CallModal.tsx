import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MonitorUp,
} from "lucide-react";
import useCallStore from "../call.store";
import { VideoTile } from "./VideoTile";

export function CallModal({
  localStream,
  remoteStream,
  peerName,
  onHangup,
  onToggleAudio,
  onToggleVideo,
  onScreenShare,
}: {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerName: string;
  onHangup: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
}) {
  const status = useCallStore((s) => s.status);
  const isMuted = useCallStore((s) => s.isMuted);
  const isVideoOff = useCallStore((s) => s.isVideoOff);
  const open =
  status === "ringing" ||
  status === "connecting" ||
  status === "active";

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-3xl p-0" hideClose>
        <div className="relative h-[60vh] w-full bg-black">
          {/* remote = main view */}
          <VideoTile
            stream={remoteStream}
            label={peerName}
            className="h-full w-full rounded-none"
          />

          {status === "connecting" && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Connecting…
            </div>
          )}

          {/* local = small overlay */}
          <VideoTile
            stream={localStream}
            muted
            label="You"
            className="absolute bottom-4 right-4 h-32 w-44 border border-white/20 shadow-lg"
          />

          {/* controls */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
            <ControlButton active={!isMuted} onClick={onToggleAudio}>
              {isMuted ? <MicOff /> : <Mic />}
            </ControlButton>
            <ControlButton active={!isVideoOff} onClick={onToggleVideo}>
              {isVideoOff ? <VideoOff /> : <Video />}
            </ControlButton>
            <ControlButton active onClick={onScreenShare}>
              <MonitorUp />
            </ControlButton>
            <Button
              size="icon"
              variant="destructive"
              className="h-12 w-12 rounded-full"
              onClick={onHangup}
            >
              <PhoneOff />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ControlButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      size="icon"
      onClick={onClick}
      className={`h-12 w-12 rounded-full ${
        active
          ? "bg-zinc-700 hover:bg-zinc-600"
          : "bg-zinc-500 hover:bg-zinc-400"
      }`}
    >
      {children}
    </Button>
  );
}

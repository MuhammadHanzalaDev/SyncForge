import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Phone, PhoneOff, Video } from "lucide-react";
import useCallStore from "../call.store";

export function IncomingCallModal({
  callerName,
  onAccept,
  onReject,
}: {
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
}) {
  const status = useCallStore((s) => s.status);
  const type = useCallStore((s) => s.callType);
  const open = status === "incoming";
  

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm text-center">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 text-2xl font-semibold">
            {callerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold">{callerName}</p>
            <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              {type === "VIDEO" ? <Video size={14} /> : <Phone size={14} />}
              Incoming {type === "VIDEO" ? "video" : "voice"} call…
            </p>
          </div>
          <div className="mt-2 flex gap-6">
            <Button
              size="lg"
              variant="destructive"
              className="h-14 w-14 rounded-full"
              onClick={onReject}
            >
              <PhoneOff />
            </Button>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700"
              onClick={onAccept}
            >
              <Phone />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

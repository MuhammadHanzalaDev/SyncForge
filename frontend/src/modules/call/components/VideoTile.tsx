import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/utils";

export function VideoTile({
  stream,
  muted = false,
  label,
  className,
}: {
  stream: MediaStream | null;
  muted?: boolean;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current && stream) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-zinc-900",
        className,
      )}
    >
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted} // local tile MUST be muted or you get echo
        className="h-full w-full object-cover"
      />
      {label && (
        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
          {label}
        </span>
      )}
    </div>
  );
}

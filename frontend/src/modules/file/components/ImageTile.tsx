"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useFileUrl } from "../file.query";
import type { NormalizedAttachment } from "../file.types";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ImageTile({
  item,
  single,
}: {
  item: NormalizedAttachment;
  single: boolean;
}) {
  const { data, isError, refetch } = useFileUrl(item.id, !item.isLocal);
  const src = item.isLocal ? item.src : data?.url;

  const [imgFailed, setImgFailed] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [retries, setRetries] = useState(0);
  const [prevSrc, setPrevSrc] = useState(src);

  // New URL arrived → reset failure + retry state (all state, no refs)
  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgFailed(false);
    setGaveUp(false);
    setRetries(0);
  }

  const showImage = src && !imgFailed;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-muted",
        single ? "w-80 max-h-80" : "h-40 w-40",
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={item.filename}
          className="h-full w-full object-cover transition-opacity"
          width={single ? 320 : 160}
          height={single ? 320 : 160}
          onError={() => {
            setImgFailed(true);
            if (retries < 2 && !item.isLocal) {
              setRetries((r) => r + 1);
              refetch();
            } else {
              setGaveUp(true);
            }
          }}
          // unoptimized={item.isLocal}
        />
      ) : isError || gaveUp ? (
        <div className="...">Failed to load</div>
      ) : (
        <Skeleton className="h-full w-full" />
      )}
    </div>
  );
}

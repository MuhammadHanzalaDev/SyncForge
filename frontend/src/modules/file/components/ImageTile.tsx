"use client";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { useFileUrl } from "../file.query";
import { useQueryClient } from "@tanstack/react-query";
import type { NormalizedAttachment } from "../file.types";

export default function ImageTile({
  item,
  single,
}: {
  item: NormalizedAttachment;
  single: boolean;
}) {
  const qc = useQueryClient();
  const { data } = useFileUrl(item.id);
  const src = false ? item.src : data?.url;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-muted",
        single ? "w-80 max-h-80" : "h-40 w-40",
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={item.filename}
          className="h-full w-full object-cover transition-opacity"
          width={single ? 320 : 160}
          height={single ? 320 : 160}
          onError={() =>
            qc.invalidateQueries({ queryKey: ["fileUrl", item.id] })
          }
          // unoptimized={item.isLocal} // blob URLs can't be optimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          {item.filename}
        </div>
      )}
    </div>
  );
}

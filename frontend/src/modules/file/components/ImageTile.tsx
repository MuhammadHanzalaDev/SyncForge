import { NormalizedAttachment } from "../file.types";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";

export default function ImageTile({
  item,
  single,
}: {
  item: NormalizedAttachment;
  single: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-muted",
        single ? "w-80 max-h-80" : "h-40 w-40",
      )}
    >
      {item.src ? (
        <Image
          src={item.src}
          alt={item.filename}
          className="h-full w-full object-cover transition-opacity"
          width={single ? 320 : 160}
          height={single ? 320 : 160}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          {item.filename}
        </div>
      )}
    </div>
  );
}

import { ReactNode } from "react";
import { NormalizedAttachment } from "../file.types";
import { getFileIcon, formatFileSize } from "../file.utils";
import { cn } from "@/shared/lib/utils";
import { Download, Loader2 } from "lucide-react";
import { useFileUrl } from "../file.query";

export default function FileTile({
  item,
  isOwn,
  metaNode,
}: {
  item: NormalizedAttachment;
  isOwn?: boolean;
  metaNode?: ReactNode;
}) {
  const { data, isLoading, isFetching } = useFileUrl(item.id, !item.isLocal);
  const src = item.isLocal ? item.src : data?.url;
  const fetching = isFetching && !src;

  // getFileIcon expects a File — fall back to a synthetic object shape.
  const Icon = getFileIcon({
    name: item.filename,
    type: item.mimetype ?? "",
  } as File);

  const className =
    "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg border max-w-65 transition-colors bg-muted/40 border-border hover:bg-muted/60";

  const content = (
    <>
      <div
        className={cn(
          "flex items-center justify-center h-9 w-9 shrink-0 rounded-md",
          isOwn
            ? "bg-primary/10 text-primary dark:bg-primary/20"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-medium truncate text-foreground">
          {item.filename}
        </span>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-muted-foreground">
            {formatFileSize(item.size || 0)}
          </span>

          {metaNode && (
            <span
              className={cn(
                "text-[10px]",
                isOwn
                  ? "[&_span]:text-primary-foreground/70 [&_svg]:text-primary-foreground"
                  : "",
              )}
            >
              {metaNode}
            </span>
          )}
        </div>
      </div>

      {fetching ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-foreground" />
      ) : src ? (
        <Download className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-foreground" />
      ) : null}
    </>
  );

  if (src) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        download={item.filename}
        className={className}
      >
        {content}
      </a>
    );
  }
  // not-yet-loaded state: render as div, optionally disabled/pulsing
  return (
    <div className={cn(className, isLoading && "opacity-60")}>{content}</div>
  );
}

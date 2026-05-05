import { X } from "lucide-react";
import type { Message } from "@/modules/message/message.types";

export default function ReplyPreview({
  message,
  currentUserId,
  onCancel,
}: {
  message: Message;
  currentUserId?: string;
  onCancel: () => void;
}) {
  const isOwnParent = message.sender.id === currentUserId;
  const senderLabel = isOwnParent ? "yourself" : message.sender?.name;
  const preview = message.content?.trim() || "Attachment";

  return (
    <div className="flex items-start gap-2 px-3 py-2 border-l-2 border-primary bg-muted/40">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-primary">
          Replying to {senderLabel}
        </p>
        <p className="text-xs text-muted-foreground truncate">{preview}</p>
      </div>
      <button
        type="button"
        onClick={onCancel}
        aria-label="Cancel reply"
        className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

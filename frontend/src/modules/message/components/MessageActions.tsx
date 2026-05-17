"use client";

import type {
  Message,
  QuickMessageReactions,
} from "@/modules/message/message.types";
import { cn } from "@/shared/lib/utils";
import { Reply, ThumbsUp, MoreVertical } from "lucide-react";
import { QUICK_REACTIONS } from "../../room/room.content";
import { CustomTooltip } from "@/shared/components";

interface MessageActionsProps {
  message: Message;
  isOwn: boolean;
  reactionsOpen: boolean;
  setReactionsOpen: (val: boolean) => void;
  onReply: (val: Message) => void;
  onReact: (messageId: string, emoji: QuickMessageReactions) => void;
  myEmojis: Set<QuickMessageReactions>;
}

const MessageActions = ({
  message,
  isOwn,
  reactionsOpen,
  setReactionsOpen,
  onReact,
  onReply,
  myEmojis,
}: MessageActionsProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-2",
        isOwn && "flex-row-reverse",
      )}
    >
      {/* Quick reaction strip — expands inline when reactionsOpen */}
      {reactionsOpen && (
        <div
          className={cn(
            "flex items-center gap-0.5 mr-1",
            isOwn && "flex-row-reverse mr-0 ml-1",
          )}
        >
          {QUICK_REACTIONS.map((emoji) => {
            const isMine = myEmojis.has(emoji);
            return (
              <button
                key={emoji}
                onClick={() => {
                  onReact?.(message.id, emoji);
                  setReactionsOpen(false);
                }}
                className={cn(
                  "p-1 rounded-md hover:bg-muted transition-colors text-sm leading-none",
                  isMine && "bg-primary/10 ring-1 ring-primary",
                )}
              >
                {emoji}
              </button>
            );
          })}
        </div>
      )}

      {/* Thumbs-up toggles the reaction strip */}
      <CustomTooltip content={"React"}>
        <button
          onClick={() => setReactionsOpen(!reactionsOpen)}
          className={cn(
            "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
            reactionsOpen && "bg-muted text-foreground",
          )}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
        </button>
      </CustomTooltip>

      {/* Reply — calls onReply so the parent can populate the input */}
      <CustomTooltip content={"Reply"}>
        <button
          onClick={() => onReply?.(message)}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Reply className="h-3.5 w-3.5" />
        </button>
      </CustomTooltip>

      <CustomTooltip content={"More"}>
        <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical className="h-3.5 w-3.5" />
        </button>
      </CustomTooltip>
    </div>
  );
};

export default MessageActions;

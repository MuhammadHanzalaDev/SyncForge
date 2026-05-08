"use client";

import type { Message } from "@/modules/message/message.types";
import { cn } from "@/shared/lib/utils";
import { Reply, ThumbsUp, MoreVertical } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { QUICK_REACTIONS } from "../../room/room.content";

interface MessageActionsProps {
  message: Message;
  isOwn: boolean;
  reactionsOpen: boolean;
  setReactionsOpen: (val: boolean) => void;
  onReply: (val: Message) => void;
  onReact: (val1: string, val2: string) => void;
}

const MessageActions = ({
  message,
  isOwn,
  reactionsOpen,
  setReactionsOpen,
  onReact,
  onReply,
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
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                // onReact?.(message.id, emoji);
                setReactionsOpen(false);
              }}
              className="p-1 rounded-md hover:bg-muted transition-colors text-sm leading-none"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Thumbs-up toggles the reaction strip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setReactionsOpen((o) => !o)}
              className={cn(
                "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
                reactionsOpen && "bg-muted text-foreground",
              )}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            React
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Reply — calls onReply so the parent can populate the input */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onReply?.(message)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Reply className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Reply
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            More
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MessageActions;

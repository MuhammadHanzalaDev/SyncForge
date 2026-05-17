"use client";

import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import type {
  AggregatedReaction,
  QuickMessageReactions,
} from "@/modules/message/message.types";
import { CustomTooltip } from "@/shared/components";

type Props = {
  reaction: AggregatedReaction;
  isOwn: boolean;
  onReact: (emoji: QuickMessageReactions) => void;
};

function ReactionPopover({ reaction, isOwn, onReact }: Props) {
  const names = [...reaction.userNames].sort((a) => (a === "You" ? -1 : 1));

  return (
    <CustomTooltip
      side="top"
      className="p-3 max-w-[160px] bg-popover text-popover-foreground border border-border [&>span]:hidden"
      align={isOwn ? "end" : "start"}
      content={
        <>
          <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1.5">
            <span className="text-sm">{reaction.emoji}</span>
            {reaction.count === 1
              ? "1 person reacted"
              : `${reaction.count} people reacted`}
          </p>

          <ScrollArea className={cn(names.length > 6 && "h-36")}>
            <ul className="flex flex-col gap-1 pr-2">
              {names.map((name) => (
                <li
                  key={name}
                  className={cn(
                    "text-xs flex items-center gap-1.5 text-foreground",
                    name === "You" && "font-medium text-primary",
                  )}
                >
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                  {name}
                </li>
              ))}
            </ul>
          </ScrollArea>

          {reaction.reactedByMe && (
            <p className="text-[10px] text-muted-foreground mt-2 pt-1.5 border-t border-border">
              Click to remove your reaction
            </p>
          )}
        </>
      }
    >
      <button
        onClick={() => onReact(reaction.emoji)}
        className={cn(
          "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border transition-colors",
          reaction.reactedByMe
            ? "bg-primary/10 border-primary text-primary hover:bg-primary/20"
            : "bg-muted border-border hover:bg-muted/80 text-foreground",
        )}
      >
        <span>{reaction.emoji}</span>
        {reaction.count > 1 && (
          <span className="font-medium">{reaction.count}</span>
        )}
      </button>
    </CustomTooltip>
  );
}

export default ReactionPopover;

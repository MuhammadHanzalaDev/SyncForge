"use client";

import type { RoomMember } from "../room.types";
import MemberAvatar from "./MemberAvatar";
const MAX_SHOWN = 2; // names shown before "+ N more"

export default function TypingIndicator({
  typingUserIds,
  members = [],
  isDirect = false,
}: {
  typingUserIds: string[];
  members?: RoomMember[];
  isDirect: boolean;
}) {
  if (!typingUserIds?.length) return null;

  const memberMap = new Map(members.map((m) => [m.id, m]));
  const typingMembers = typingUserIds
    .map((id) => memberMap.get(id))
    .filter(Boolean) as RoomMember[];

  if (!typingMembers.length) return null;

  // Build label: "Alice", "Alice and Bob", "Alice, Bob and 2 more"
  const shown = typingMembers.slice(0, MAX_SHOWN);
  const overflow = typingMembers.length - MAX_SHOWN;

  let label: string;
  if (isDirect) {
    label = ""; // direct chat — no names needed
  } else if (typingMembers.length === 1) {
    label = shown[0].name;
  } else if (overflow <= 0) {
    label = shown.map((m) => m.name.split(" ")[0]).join(" and ");
  } else {
    label =
      shown.map((m) => m.name.split(" ")[0]).join(", ") +
      ` and ${overflow} more`;
  }

  const suffix = typingMembers.length === 1 ? "is typing" : "are typing";

  return (
    <div className="flex items-center gap-3 px-4 py-1 min-h-[36px]">
      {/* Spacer that matches avatar column in messages */}
      <div className="w-8 shrink-0" />

      <div className="flex items-center gap-2">
        {/* Stacked mini avatars (only in group chats) */}
        {!isDirect && (
          <div className="flex -space-x-1.5">
            {shown.map((m) => (
              <MemberAvatar
                key={m.id}
                member={m}
                size="xs"
                showStatus={false}
                className="ring-1 ring-background rounded-full"
              />
            ))}
            {overflow > 0 && (
              <span
                className="
                  inline-flex items-center justify-center
                  w-5 h-5 rounded-full text-[9px] font-semibold
                  ring-1 ring-background shrink-0
                  bg-muted text-muted-foreground
                "
              >
                +{overflow}
              </span>
            )}
          </div>
        )}

        {/* Bubble with dots */}
        <div className="flex items-center gap-1.5 bg-muted rounded-2xl px-3.5 py-2.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* "Alice and Bob are typing" — only in group chats */}
        {!isDirect && label && (
          <span className="text-[11px] text-muted-foreground leading-none">
            {label} {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

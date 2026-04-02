import type { Member } from "./chat.types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const STATUS_COLORS: Record<Member["status"], string> = {
  online: "bg-emerald-500",
  away: "bg-amber-400",
  busy: "bg-rose-500",
  offline: "bg-zinc-400",
};

export { getInitials, STATUS_COLORS };

import { UserStatusType } from "../user/user.types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const STATUS_COLORS: Record<UserStatusType, string> = {
  ONLINE: "bg-emerald-500",
  AWAY: "bg-amber-400",
  BUSY: "bg-rose-500",
  OFFLINE: "bg-zinc-400",
};

export { getInitials, STATUS_COLORS };

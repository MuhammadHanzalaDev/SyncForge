"use client";

import type { RoomMember } from "../room.types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { getInitials } from "../room.utils";
import StatusDot from "./StatusDot";
import useUserStatusStore from "@/shared/store/userStatusStore";

export default function MemberAvatar({
  member,
  size = "md",
  showStatus = true,
  className,
}: {
  member: RoomMember;
  size?: "xs" | "sm" | "md" | "lg";
  showStatus?: boolean;
  className?: string;
}) {
  const getUserStatus = useUserStatusStore((state) => state.getUserStatus);
  const sizeClass =
    size === "xs"
      ? "h-5 w-5 text-[9px]"
      : size === "sm"
        ? "h-7 w-7 text-xs"
        : size === "lg"
          ? "h-10 w-10 text-sm"
          : "h-8 w-8 text-xs";

  return (
    <div className="relative shrink-0">
      <Avatar className={`${sizeClass} ${className ?? ""}`}>
        {" "}
        <AvatarImage src={member.avatar} className="object-cover" />
        <AvatarFallback
          className={`bg-primary/10 text-primary font-semibold ${size === "xs" ? "text-[10px]" : ""}`}
        >
          {getInitials(member.name)}
        </AvatarFallback>
      </Avatar>
      {showStatus && <StatusDot status={getUserStatus(member.id)} />}
    </div>
  );
}

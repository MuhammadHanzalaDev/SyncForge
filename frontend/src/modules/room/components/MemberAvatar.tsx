"use client";

import type { Member } from "../room.types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { getInitials } from "../room.utils";
import StatusDot from "./StatusDot";

export default function MemberAvatar({
  member,
  size = "md",
}: {
  member: Member;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm"
      ? "h-7 w-7 text-xs"
      : size === "lg"
        ? "h-10 w-10 text-sm"
        : "h-8 w-8 text-xs";
  return (
    <div className="relative shrink-0">
      <Avatar className={sizeClass}>
        <AvatarImage src={member.avatar} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {getInitials(member.name)}
        </AvatarFallback>
      </Avatar>
      <StatusDot status={member.status} />
    </div>
  );
}

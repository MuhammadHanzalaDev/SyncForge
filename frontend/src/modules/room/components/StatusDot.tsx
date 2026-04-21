"use client";

import { STATUS_COLORS } from "../room.utils";
import { UserStatusType } from "@/modules/user/user.types";
import { cn } from "@/shared/lib/utils";

export default function StatusDot({ status }: { status: UserStatusType }) {
  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
        STATUS_COLORS[status],
      )}
    />
  );
}

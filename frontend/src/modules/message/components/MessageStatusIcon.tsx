"use client";

import { Check, CheckCheck } from "lucide-react";
import type { MessageStatus } from "@/modules/message/message.types";

export default function MessageStatusIcon({
  status,
  insideBubble = false,
}: {
  status?: MessageStatus;
  insideBubble?: boolean;
}) {
  if (!status) return null;

  if (status === "READ")
    return (
      <CheckCheck
        className={
          insideBubble
            ? "h-3 w-3 text-primary-foreground"
            : "h-3 w-3 text-primary"
        }
      />
    );

  if (status === "DELIVERED")
    return (
      <CheckCheck
        className={
          insideBubble
            ? "h-3 w-3 text-primary-foreground/60"
            : "h-3 w-3 text-muted-foreground"
        }
      />
    );

  // SENT
  return (
    <Check
      className={
        insideBubble
          ? "h-3 w-3 text-primary-foreground/60"
          : "h-3 w-3 text-muted-foreground"
      }
    />
  );
}

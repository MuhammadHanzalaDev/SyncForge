"use client";

import { Check, CheckCheck } from "lucide-react";
import type { MessageStatus } from "@/modules/message/message.types";

export default function MessageStatusIcon({
  status,
}: {
  status?: MessageStatus;
}) {
  if (!status) return null;
  if (status === "READ") return <CheckCheck className="h-3 w-3 text-primary" />;
  if (status === "DELIVERED")
    return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
  return <Check className="h-3 w-3 text-muted-foreground" />;
}

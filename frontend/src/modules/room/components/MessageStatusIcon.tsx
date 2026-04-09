"use client";

import { Check, CheckCheck } from "lucide-react";
import type { Message } from "@/modules/message/message.types";

export default function MessageStatusIcon({
  status,
}: {
  status?: Message["status"];
}) {
  if (!status) return null;
  if (status === "sent")
    return <Check className="h-3 w-3 text-muted-foreground" />;
  if (status === "delivered")
    return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
  return <CheckCheck className="h-3 w-3 text-primary" />;
}

"use client";

import type { Member } from "../chat.types";
import { X, MessageSquare, UserPlus } from "lucide-react";
import MemberAvatar from "./MemberAvatar";
import { Badge } from "@/shared/components/ui/badge";
import { CustomButton } from "@/shared/components";

export default function MemberListPanel({
  members,
  onClose,
}: {
  members: Member[];
  onClose: () => void;
}) {
  const online = members.filter((m) => m.status !== "offline");
  const offline = members.filter((m) => m.status === "offline");

  return (
    <div className="w-64 border-l flex flex-col bg-background shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-sm">Members ({members.length})</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-muted text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <p className="px-4 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Online — {online.length}
        </p>
        {online.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-2.5 px-4 py-1.5 hover:bg-muted/50 cursor-pointer rounded-md mx-1 group"
          >
            <MemberAvatar member={m} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium truncate">{m.name}</span>
                {m.role === "admin" && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1 py-0 h-4 shrink-0"
                  >
                    Admin
                  </Badge>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground capitalize">
                {m.status}
              </span>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {offline.length > 0 && (
          <>
            <p className="px-4 py-1 mt-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Offline — {offline.length}
            </p>
            {offline.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-2.5 px-4 py-1.5 hover:bg-muted/50 cursor-pointer rounded-md mx-1 opacity-60"
              >
                <MemberAvatar member={m} />
                <div>
                  <span className="text-sm truncate">{m.name}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="p-3 border-t">
        <CustomButton
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Members
        </CustomButton>
      </div>
    </div>
  );
}

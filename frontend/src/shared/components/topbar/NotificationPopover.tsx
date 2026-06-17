"use client";

import React from "react";
import { useState } from "react";
import {
  Bell,
  AtSign,
  Reply,
  Heart,
  UserPlus,
  Building2,
  Info,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

// ── Types (loosely mirror your Prisma model; swap for your API response) ──
type NotificationType =
  | "MENTION"
  | "REPLY"
  | "REACTION"
  | "ROOM_INVITE"
  | "WORKSPACE_INVITE"
  | "SYSTEM";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string; // ISO string
  actorName?: string;
}

// ── Icon + accent per type ──
const typeConfig: Record<
  NotificationType,
  { icon: React.ComponentType<{ className?: string }>; tint: string }
> = {
  MENTION: { icon: AtSign, tint: "text-blue-500 bg-blue-500/10" },
  REPLY: { icon: Reply, tint: "text-violet-500 bg-violet-500/10" },
  REACTION: { icon: Heart, tint: "text-pink-500 bg-pink-500/10" },
  ROOM_INVITE: { icon: UserPlus, tint: "text-emerald-500 bg-emerald-500/10" },
  WORKSPACE_INVITE: { icon: Building2, tint: "text-amber-500 bg-amber-500/10" },
  SYSTEM: { icon: Info, tint: "text-muted-foreground bg-muted" },
};

// ── Dummy data ──
const DUMMY: NotificationItem[] = [
  {
    id: "1",
    type: "MENTION",
    title: "Sarah Chen mentioned you",
    body: "@you can you review the auth flow before standup?",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    actorName: "Sarah Chen",
  },
  {
    id: "2",
    type: "REPLY",
    title: "New reply in #engineering",
    body: "Marcus replied to your message about the Prisma migration.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    actorName: "Marcus",
  },
  {
    id: "3",
    type: "REACTION",
    title: "Aisha reacted 🎉",
    body: "Aisha reacted to your message in #design.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    actorName: "Aisha",
  },
  {
    id: "4",
    type: "WORKSPACE_INVITE",
    title: "You were added to Acme Corp",
    body: "Tom invited you to the Acme Corp workspace.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    actorName: "Tom",
  },
  {
    id: "5",
    type: "SYSTEM",
    title: "Password changed",
    body: "Your password was successfully updated.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];

// ── Relative time helper ──
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export default function NotificationPopover() {
  const [items, setItems] = useState<NotificationItem[]>(DUMMY);
  const [open, setOpen] = useState(false);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

  const renderList = (list: NotificationItem[]) =>
    list.length === 0 ? (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">You're all caught up</p>
        <p className="text-xs text-muted-foreground">No new notifications</p>
      </div>
    ) : (
      <div className="flex flex-col">
        {list.map((n) => {
          const { icon: Icon, tint } = typeConfig[n.type];
          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
                !n.isRead && "bg-primary/[0.04]",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  tint,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-sm font-medium leading-tight">
                  {n.title}
                </p>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {n.body}
                </p>
                <span className="mt-0.5 text-[11px] text-muted-foreground">
                  {timeAgo(n.createdAt)}
                </span>
              </div>

              {!n.isRead && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative inline-flex cursor-pointer">
          <Bell className="h-6 w-6 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="h-auto gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Unread{unreadCount > 0 && ` (${unreadCount})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[360px]">{renderList(items)}</ScrollArea>
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[360px]">
              {renderList(items.filter((n) => !n.isRead))}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="border-t p-1">
          <Button
            variant="ghost"
            className="w-full justify-center text-xs text-muted-foreground hover:text-foreground"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Phone,
  Video,
  Search,
  Info,
  Paperclip,
  Smile,
  Send,
  MoreVertical,
  Hash,
  Users,
  Pin,
  Bell,
  BellOff,
  UserPlus,
  Settings,
  ChevronRight,
  ImageIcon,
  File,
  Mic,
  X,
  Check,
  CheckCheck,
  Reply,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatType = "chat" | "room";

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "busy" | "offline";
  role?: "admin" | "member";
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
  reactions?: { emoji: string; count: number; reacted: boolean }[];
  replyTo?: { id: string; senderName: string; content: string };
  attachments?: { type: "image" | "file"; name: string; url?: string }[];
  isOwn?: boolean;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_MEMBERS: Member[] = [
  { id: "1", name: "Alex Johnson", status: "online", role: "admin" },
  { id: "2", name: "Sarah Chen", status: "online", role: "member" },
  { id: "3", name: "Marcus Williams", status: "away", role: "member" },
  { id: "4", name: "Priya Patel", status: "busy", role: "member" },
  { id: "5", name: "Tom Eriksson", status: "offline", role: "member" },
  { id: "6", name: "Layla Hassan", status: "online", role: "member" },
];

const DUMMY_MESSAGES: Message[] = [
  {
    id: "m1",
    senderId: "2",
    senderName: "Sarah Chen",
    content:
      "Hey everyone! Just pushed the latest design updates to Figma. Can someone review?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reactions: [{ emoji: "👀", count: 3, reacted: false }],
  },
  {
    id: "m2",
    senderId: "3",
    senderName: "Marcus Williams",
    content: "On it! Give me 10 minutes.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
    reactions: [{ emoji: "👍", count: 2, reacted: true }],
  },
  {
    id: "m3",
    senderId: "1",
    senderName: "Alex Johnson",
    content:
      "Reviewed! Left a few comments. The onboarding flow looks great — just one concern about mobile breakpoints on the third screen.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    replyTo: {
      id: "m1",
      senderName: "Sarah Chen",
      content: "Hey everyone! Just pushed the latest design updates...",
    },
  },
  {
    id: "m4",
    senderId: "me",
    senderName: "You",
    content:
      "I can take a look at those breakpoints. Do you have the specific screen sizes we're targeting?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: "read",
    isOwn: true,
  },
  {
    id: "m5",
    senderId: "2",
    senderName: "Sarah Chen",
    content:
      "320px, 375px, 414px for mobile. We're also targeting 768px for tablet. I've noted it all in the Figma file under the 'Specs' page.",
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    reactions: [{ emoji: "✅", count: 1, reacted: false }],
  },
  {
    id: "m6",
    senderId: "4",
    senderName: "Priya Patel",
    content:
      "Quick heads up — the standup's been moved to 3pm today. Just got the calendar invite.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: "m7",
    senderId: "me",
    senderName: "You",
    content: "Got it, thanks Priya! Will be there.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    status: "delivered",
    isOwn: true,
  },
  {
    id: "m8",
    senderId: "6",
    senderName: "Layla Hassan",
    content: "Same here 👋",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    reactions: [{ emoji: "🙌", count: 2, reacted: false }],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateDivider(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: Member["status"] }) {
  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
        STATUS_COLORS[status],
      )}
    />
  );
}

function MemberAvatar({
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

function MessageStatusIcon({ status }: { status?: Message["status"] }) {
  if (!status) return null;
  if (status === "sent")
    return <Check className="h-3 w-3 text-muted-foreground" />;
  if (status === "delivered")
    return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
  return <CheckCheck className="h-3 w-3 text-primary" />;
}

function MessageBubble({
  message,
  showAvatar,
}: {
  message: Message;
  showAvatar: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex gap-3 group px-4 py-1 hover:bg-muted/30 rounded-lg transition-colors",
        message.isOwn && "flex-row-reverse",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div className="w-8 shrink-0 mt-1">
        {showAvatar && !message.isOwn && (
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                {getInitials(message.senderName)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          message.isOwn && "items-end",
        )}
      >
        {showAvatar && (
          <div
            className={cn(
              "flex items-baseline gap-2 mb-1",
              message.isOwn && "flex-row-reverse",
            )}
          >
            <span className="text-sm font-semibold text-foreground">
              {message.isOwn ? "You" : message.senderName}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

        {/* Reply preview */}
        {message.replyTo && (
          <div
            className={cn(
              "flex items-center gap-2 mb-1.5 text-xs text-muted-foreground border-l-2 border-primary/40 pl-2 py-0.5",
              message.isOwn &&
                "flex-row-reverse border-l-0 border-r-2 pr-2 pl-0",
            )}
          >
            <Reply className="h-3 w-3 shrink-0" />
            <span className="font-medium">{message.replyTo.senderName}:</span>
            <span className="truncate max-w-[200px]">
              {message.replyTo.content}
            </span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
            message.isOwn
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm",
          )}
        >
          {message.content}
        </div>

        {/* Reactions + status */}
        <div
          className={cn(
            "flex items-center gap-2 mt-1",
            message.isOwn && "flex-row-reverse",
          )}
        >
          {message.reactions?.map((r) => (
            <button
              key={r.emoji}
              className={cn(
                "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border transition-colors",
                r.reacted
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-muted border-border hover:bg-muted/80",
              )}
            >
              {r.emoji} {r.count}
            </button>
          ))}
          {!showAvatar && (
            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTime(message.timestamp)}
            </span>
          )}
          {message.isOwn && <MessageStatusIcon status={message.status} />}
        </div>
      </div>

      {/* Hover actions */}
      <div
        className={cn(
          "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-2",
          message.isOwn && "flex-row-reverse",
        )}
      >
        {[
          { icon: ThumbsUp, label: "React" },
          { icon: Reply, label: "Reply" },
          { icon: MoreVertical, label: "More" },
        ].map(({ icon: Icon, label }) => (
          <TooltipProvider key={label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

function MemberListPanel({
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
        <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
          <UserPlus className="h-3.5 w-3.5" />
          Add Members
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const params = useParams();
  const id = params?.id as string;

  // Determine if this is a room or direct chat (in real app, derive from data)
  // For demo: IDs starting with "r" = room, else = direct chat
  const isRoom = true; // toggle to false to see direct chat UI

  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [isTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      senderName: "You",
      content: inputValue.trim(),
      timestamp: new Date(),
      status: "sent",
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const dummyName = isRoom ? "Design & Frontend" : "Sarah Chen";
  const dummyStatus = isRoom ? `${DUMMY_MEMBERS.length} members` : "online";
  const onlineCount = DUMMY_MEMBERS.filter(
    (m) => m.status !== "offline",
  ).length;

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* ── Main Chat Area ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-background/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {isRoom ? (
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 text-primary shrink-0">
                <Hash className="h-5 w-5" />
              </div>
            ) : (
              <div className="relative shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {getInitials(dummyName)}
                  </AvatarFallback>
                </Avatar>
                <StatusDot status="online" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-base truncate">
                  {dummyName}
                </h1>
                {isRoom && (
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {onlineCount} online
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {isRoom
                  ? `${DUMMY_MEMBERS.length} members · ${onlineCount} online`
                  : "Active now"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <TooltipProvider>
              {[
                { icon: Phone, label: "Voice Call" },
                { icon: Video, label: "Video Call" },
                { icon: Search, label: "Search" },
              ].map(({ icon: Icon, label }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {label}
                  </TooltipContent>
                </Tooltip>
              ))}

              {isRoom && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        showMembers
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() => setShowMembers((v) => !v)}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Members
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Details
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="gap-2 text-sm">
                    <Pin className="h-4 w-4" /> Pinned Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-sm">
                    <Bell className="h-4 w-4" /> Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-sm">
                    <File className="h-4 w-4" /> Shared Files
                  </DropdownMenuItem>
                  {isRoom && (
                    <DropdownMenuItem className="gap-2 text-sm">
                      <Settings className="h-4 w-4" /> Room Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-sm text-destructive">
                    <BellOff className="h-4 w-4" /> Mute
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-0.5">
          {/* Date divider */}
          <div className="flex items-center gap-3 px-4 py-2">
            <Separator className="flex-1" />
            <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 shrink-0">
              {formatDateDivider(messages[0].timestamp)}
            </span>
            <Separator className="flex-1" />
          </div>

          {messages.map((message, idx) => {
            const prevMessage = messages[idx - 1];
            const showAvatar =
              !prevMessage ||
              prevMessage.senderId !== message.senderId ||
              message.timestamp.getTime() - prevMessage.timestamp.getTime() >
                1000 * 60 * 5;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                showAvatar={showAvatar}
              />
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 px-4 py-1">
              <div className="w-8" />
              <div className="flex items-center gap-1.5 bg-muted rounded-2xl px-3.5 py-2.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 pb-4 shrink-0">
          <div className="flex flex-col rounded-xl border bg-background shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-2 pt-2 pb-1">
              {[
                { icon: Paperclip, label: "Attach file" },
                { icon: ImageIcon, label: "Image" },
                { icon: Smile, label: "Emoji" },
                { icon: Mic, label: "Voice message" },
              ].map(({ icon: Icon, label }) => (
                <TooltipProvider key={label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Icon className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2 px-3 pb-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isRoom
                    ? `Message #${dummyName.toLowerCase().replace(/\s/g, "-")}`
                    : `Message ${dummyName}`
                }
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 resize-none"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-lg transition-all",
                  inputValue.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    : "text-muted-foreground/40 cursor-not-allowed",
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-1.5">
            Press{" "}
            <kbd className="font-mono bg-muted rounded px-1 text-[10px]">
              Enter
            </kbd>{" "}
            to send ·{" "}
            <kbd className="font-mono bg-muted rounded px-1 text-[10px]">
              Shift+Enter
            </kbd>{" "}
            for new line
          </p>
        </div>
      </div>

      {/* ── Members Panel (Room only) ── */}
      {isRoom && showMembers && (
        <MemberListPanel
          members={DUMMY_MEMBERS}
          onClose={() => setShowMembers(false)}
        />
      )}
    </div>
  );
}

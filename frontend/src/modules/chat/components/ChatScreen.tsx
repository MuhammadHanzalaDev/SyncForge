"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { DUMMY_MEMBERS, DUMMY_MESSAGES, DM_MESSAGES } from "../chat.content";
import type { Message } from "../chat.types";
import {
  Hash,
  Phone,
  Video,
  Search,
  Users,
  Info,
  MoreVertical,
  Pin,
  Bell,
  File,
  Settings,
  BellOff,
  Paperclip,
  Smile,
  Send,
  ImageIcon,
  Mic,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import StatusDot from "./StatusDot";
import { getInitials } from "../chat.utils";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { CustomButton } from "@/shared/components";
import { cn } from "@/shared/lib/utils";
import { formatDateDivider } from "@/shared/utils/date";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { STATUS_COLORS } from "../chat.utils";
import MessageBubble from "./MessageBubble";
import MemberListPanel from "./MembersListPanel";
import useChatSocket from "../hooks/useChatSocket";

export default function ChatScreen() {
  const params = useParams();
  const id = params?.chatId as string;
  useChatSocket(id);

  // Determine if this is a room or direct chat (in real app, derive from data)
  // For demo: IDs starting with "r" = room, else = direct chat
  const isRoom = false; // toggle to false to see direct chat UI
  const dmPeer = DUMMY_MEMBERS[1];

  const [messages, setMessages] = useState<Message[]>(
    isRoom ? DUMMY_MESSAGES : DM_MESSAGES,
  );
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
    (m) => m.status !== "OFFLINE",
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
                <StatusDot status="ONLINE" />
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
                  : dmPeer.status === "ONLINE"
                    ? "Active now"
                    : dmPeer.status === "AWAY"
                      ? "Away"
                      : "Offline"}
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
                    <CustomButton
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </CustomButton>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {label}
                  </TooltipContent>
                </Tooltip>
              ))}

              {isRoom && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CustomButton
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
                    </CustomButton>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Members
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <CustomButton
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Info className="h-4 w-4" />
                  </CustomButton>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Details
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CustomButton
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </CustomButton>
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

          {!isRoom && (
            <div className="flex flex-col items-center gap-2 py-6 px-4 text-center">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                    {getInitials(dmPeer.name)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-background",
                    STATUS_COLORS[dmPeer.status],
                  )}
                />
              </div>
              <div>
                <p className="font-semibold text-base">{dmPeer.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This is the beginning of your direct message history with{" "}
                  <span className="font-medium">{dmPeer.name}</span>.
                </p>
              </div>
            </div>
          )}

          {!isRoom && (
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
                View Profile
              </TooltipContent>
            </Tooltip>
          )}

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

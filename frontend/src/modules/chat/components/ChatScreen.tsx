"use client";

import { useState, useRef, useEffect } from "react";
import { DM_MESSAGES } from "../chat.content";
import type { Message } from "../chat.types";
import { Info, Paperclip, Smile, Send, ImageIcon, Mic } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { getInitials } from "../chat.utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { formatDateDivider } from "@/shared/utils/date";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { STATUS_COLORS } from "../chat.utils";
import MessageBubble from "./MessageBubble";
import useChatStore from "../chat.store";

export default function ChatScreen() {
  const activeChat = useChatStore((state) => state.activeChat);
  const [messages, setMessages] = useState<Message[]>(DM_MESSAGES);
  const [inputValue, setInputValue] = useState("");
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

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-0.5 min-h-0">
        {/* Date divider */}
        <div className="flex items-center gap-3 px-4 py-2">
          <Separator className="flex-1" />
          <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 shrink-0">
            {formatDateDivider(messages[0].timestamp)}
          </span>
          <Separator className="flex-1" />
        </div>

        <div className="flex flex-col items-center gap-2 py-6 px-4 text-center">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {getInitials(activeChat?.name || "")}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-background",
                STATUS_COLORS[activeChat?.status || "OFFLINE"],
              )}
            />
          </div>

          <div>
            <div className="flex justify-center items-center gap-1">
              <p className="font-semibold text-base">{activeChat?.name}</p>
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
                <TooltipContent className="text-xs">
                  View Profile
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              This is the beginning of your direct message history with{" "}
              <span className="font-medium">{activeChat?.name}</span>.
            </p>
          </div>
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
              placeholder={`Message ${activeChat?.name}`}
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
  );
}

"use client";

import { useState, useRef, useMemo } from "react";
import type { Message } from "@/modules/message/message.types";
import {
  Info,
  Paperclip,
  Smile,
  Send,
  ImageIcon,
  Mic,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { getInitials } from "../room.utils";
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
import { STATUS_COLORS } from "../room.utils";
import MessageBubble from "./MessageBubble";
import MessageAttachments from "./MessageAttachements";
import {
  Attachment,
  MessageAttachmentsHandle,
} from "@/modules/file/file.types";
import useRoomStore from "../room.store";
import useMessageSocket from "@/modules/message/hooks/useMessageSocket";
import useTypingSocket from "@/modules/message/hooks/useTypingSocket";
import { useMessages } from "@/modules/message/message.query";
import { InfiniteScrollContainer } from "@/shared/components";
import type { InfiniteScrollContainerHandle } from "@/shared/components/common/InfiniteScrollContainer";
import { useSendMessage } from "@/modules/message/message.mutation";
import { useScrollBehavior } from "../hooks/useScrollBehaviour";
import { useUploadAttachments } from "@/modules/file/file.mutation";

export default function ChatScreen() {
  // refs
  const scrollRef = useRef<InfiniteScrollContainerHandle>(null);
  const attachmentsRef = useRef<MessageAttachmentsHandle>(null);

  // local states
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // global client states
  const activeChat = useRoomStore((state) => state.activeChat);
  const roomId = useRoomStore((state) => state.roomId);

  // mutations
  const { mutate: mutateSendMessage } = useSendMessage(roomId);

  // server states
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(roomId);

  const messages: Message[] = useMemo(() => {
    const flat = data?.pages.flatMap((p) => p.data) || [];
    return [...flat].reverse();
  }, [data?.pages]);

  // hooks
  const { handleTyping, typingUsers } = useTypingSocket(roomId);
  useScrollBehavior(messages, typingUsers, scrollRef);
  useMessageSocket(roomId);

  const handleSend = () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    // Block send while any attachment is still uploading.
    const stillUploading = attachments.some((a) => a.status === "uploading");
    if (stillUploading) return;

    const uploadedIds = attachments
      .filter((a) => a.status === "done" && a.uploadedId)
      .map((a) => a.uploadedId!);

    const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    mutateSendMessage({
      tempId,
      roomId: roomId || "",
      content: inputValue.trim(),
      attachmentIds: uploadedIds, // adjust key to match your send-message payload
      attachments: attachments,
    });

    setInputValue("");
    attachmentsRef.current?.clear();
  };

  const canSend =
    (inputValue.trim().length > 0 || attachments.length > 0) &&
    !attachments.some((a) => a.status === "uploading");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toolbarButtons = [
    {
      icon: Paperclip,
      label: "Attach file",
      onClick: () => attachmentsRef.current?.openFilePicker(),
    },
    {
      icon: ImageIcon,
      label: "Image",
      onClick: () => attachmentsRef.current?.openImagePicker(),
    },
    { icon: Smile, label: "Emoji", onClick: () => {} },
    { icon: Mic, label: "Voice message", onClick: () => {} },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable area — contains header + messages */}
      <InfiniteScrollContainer
        ref={scrollRef}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        direction="top"
        className="flex-1 min-h-0"
      >
        {/* Loading indicator for older messages */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Conversation start header — only shown when no more messages to load */}
        {!hasNextPage && (
          <>
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
                  <TooltipProvider>
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
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This is the beginning of your direct message history with{" "}
                  <span className="font-medium">{activeChat?.name}</span>.
                </p>
              </div>
            </div>

            {/* Date divider for first message */}
            {messages[0] && (
              <div className="flex items-center gap-3 px-4 py-2">
                <Separator className="flex-1" />
                <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 shrink-0">
                  {formatDateDivider(messages[0].createdAt)}
                </span>
                <Separator className="flex-1" />
              </div>
            )}
          </>
        )}

        {/* Messages in natural order: oldest -> newest */}
        {messages.map((message, idx) => {
          const prevMessage = messages[idx - 1];
          const currTime = new Date(message.createdAt).getTime();
          const prevTime = prevMessage
            ? new Date(prevMessage.createdAt).getTime()
            : 0;

          const showAvatar =
            !prevMessage ||
            prevMessage.sender.id !== message.sender.id ||
            currTime - prevTime > 1000 * 60 * 5;

          return (
            <MessageBubble
              key={message?.id}
              message={message}
              showAvatar={showAvatar}
            />
          );
        })}

        {/* Typing indicator */}
        {typingUsers?.length > 0 && (
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
      </InfiniteScrollContainer>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <div className="flex flex-col rounded-xl border bg-background shadow-sm overflow-hidden">
          <MessageAttachments
            ref={attachmentsRef}
            attachments={attachments}
            onAttachmentsChange={setAttachments}
          />

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-2 pt-2 pb-1">
            {toolbarButtons.map(({ icon: Icon, label, onClick }) => (
              <TooltipProvider key={label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={onClick}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
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
              onChange={(e) => {
                setInputValue(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeChat?.name || ""}`}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-lg transition-all",
                canSend
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

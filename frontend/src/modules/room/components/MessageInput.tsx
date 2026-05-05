"use client";

import { useState, useRef } from "react";
import type { Message } from "@/modules/message/message.types";
import { Paperclip, Smile, Send, ImageIcon, Mic } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import MessageAttachments from "./MessageAttachements";
import ReplyPreview from "./ReplyPreview";
import {
  Attachment,
  MessageAttachmentsHandle,
} from "@/modules/file/file.types";
import useTypingSocket from "@/modules/message/hooks/useTypingSocket";
import { useSendMessage } from "@/modules/message/message.mutation";
import { usePersonalInfo } from "@/modules/user/user.query";
import { Chat } from "../room.types";

interface MessageInputProps {
  roomId: string | null;
  activeChat: Chat | null;
  replyingTo: Message | null;
  onCancelReply: () => void;
  onSent: () => void;
}

const MessageInput = ({
  roomId,
  activeChat,
  replyingTo,
  onCancelReply,
  onSent,
}: MessageInputProps) => {
  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const attachmentsRef = useRef<MessageAttachmentsHandle>(null);

  // local states
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // mutations
  const { mutate: mutateSendMessage } = useSendMessage(roomId);

  // server states
  const { data: personalInfo } = usePersonalInfo();

  // hooks
  const { handleTyping } = useTypingSocket(roomId);

  // local functions
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
      ...(replyingTo
        ? {
            parentId: replyingTo.id,
            parent: {
              id: replyingTo.id,
              content: replyingTo.content || "",
              sender: {
                id: replyingTo.sender.id,
                name: replyingTo.sender.name,
              },
            },
          }
        : {}),
    });

    onSent();
    setInputValue("");
    onCancelReply();
  };

  const canSend =
    (inputValue.trim().length > 0 || attachments.length > 0) &&
    !attachments.some((a) => a.status === "uploading");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape" && replyingTo) {
      e.preventDefault();
      onCancelReply();
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
    <div className="px-4 pb-4 pt-2 shrink-0">
      <div className="flex flex-col rounded-xl border bg-background shadow-sm overflow-hidden">
        {/* Reply preview */}
        {replyingTo && (
          <ReplyPreview
            message={replyingTo}
            currentUserId={personalInfo?.id}
            onCancel={onCancelReply}
          />
        )}

        {/* Attachments preview */}
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
            ref={inputRef}
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
        <kbd className="font-mono bg-muted rounded px-1 text-[10px]">Enter</kbd>{" "}
        to send ·{" "}
        <kbd className="font-mono bg-muted rounded px-1 text-[10px]">
          Shift+Enter
        </kbd>{" "}
        for new line
      </p>
    </div>
  );
};

export default MessageInput;

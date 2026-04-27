import { InfiniteData } from "@tanstack/react-query";
import type { Attachment } from "../file/file.types";

interface SendMessage {
  tempId?: string; // Temporary ID for optimistic UI updates
  roomId: string;
  content: string;
  parentId?: string;
  attachmentIds?: string[];
  attachments: Attachment[];
}

interface ReadMessage {
  roomId: string;
  messageId: string;
}

interface MessageSender {
  id: string;
  name: string;
  avatar?: string;
}

interface MessageReaction {
  id: string;
  userId: string;
  emoji: string;
}

type MessageStatus = "SENT" | "DELIVERED" | "READ";

interface MessageReceipt {
  messageId: string;
  userId: string;
  status: MessageStatus;
  updatedAt: Date;
}

interface MessageAttachment {
  id: string;
  url: string; // Full URL to the file
  filename: string; // Original filename
  mimetype: string; // e.g., "image/png"
  size: number; // Bytes
  kind: "IMAGE" | "FILE";
}

interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited?: boolean;
  parentId?: string;
  attachments?: MessageAttachment[];
  tempAttachments?: Attachment[];
  reactions?: MessageReaction[];
  status: MessageStatus;
  isOwn?: boolean;
  tempId?: string;
}

interface GetMessagesParams {
  cursor: string | null;
}

interface MessagesPage {
  data: Message[];
}

type MessageseData = InfiniteData<MessagesPage>;

interface TypingData {
  userId: string;
  name: string;
}

interface NewMessage {
  message: Message;
  roomId: string;
}

export type {
  Message,
  SendMessage,
  GetMessagesParams,
  MessageseData,
  TypingData,
  MessageAttachment,
  MessageStatus,
  MessageReceipt,
  ReadMessage,
  NewMessage,
};

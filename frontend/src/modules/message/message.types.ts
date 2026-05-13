import { InfiniteData } from "@tanstack/react-query";
import type { Attachment, AttachmentKind } from "../file/file.types";

interface SendMessage {
  tempId?: string; // Temporary ID for optimistic UI updates
  roomId: string;
  content: string;
  parentId?: string;
  parent?: MessageParent;
  attachmentIds?: string[];
  attachments?: Attachment[];
}

interface MessageParent {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
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
  kind: AttachmentKind;
  durationSec?: number;
}

interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited?: boolean;
  parentId?: string;
  parent?: MessageParent;
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

type MessagesData = InfiniteData<MessagesPage>;

interface TypingData {
  userId: string;
  name: string;
}

interface NewMessage {
  message: Message;
  roomId: string;
}

type MessageReactionAction = "added" | "removed" | "updated";

interface MessageReactionEventPayload {
  action: MessageReactionAction;
  messageId: string;
  userId: string;
  roomId: string;
  emoji: string;
}


export type {
  Message,
  SendMessage,
  GetMessagesParams,
  MessagesData,
  TypingData,
  MessageAttachment,
  MessageStatus,
  MessageReceipt,
  ReadMessage,
  NewMessage,
  MessageReaction,
  MessageReactionEventPayload,
};

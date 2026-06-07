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
  messageCreatedAt: string | Date;
}

type QuickMessageReactions = "👍" | "❤️" | "😂" | "😮";

interface ReactMessage {
  roomId: string;
  messageId?: string;
  emoji: QuickMessageReactions;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface MessageSender {
  id: string;
  name: string;
  avatar?: string;
}

interface MessageReaction {
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  emoji: QuickMessageReactions;
}

type MessageStatus = "SENT" | "DELIVERED" | "READ";

interface MessageReceipt {
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
  receipts: MessageReceipt[];
}

interface GetMessagesParams {
  cursor: string | null;
}

interface MessagesPage {
  data: Message[];
  lastReadAt: string | Date;
  lastReadMessageId?: string;
  nextCursor: string | null;
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
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  roomId: string;
  emoji: QuickMessageReactions;
}

type AggregatedReaction = {
  emoji: QuickMessageReactions;
  count: number;
  userIds: string[];
  userNames: string[];
  reactedByMe: boolean;
};

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
  ReactMessage,
  QuickMessageReactions,
  MessageReactionAction,
  AggregatedReaction,
};

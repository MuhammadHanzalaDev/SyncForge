import type { FileKind } from "../storage/storage.types";

interface GetMessageRequest {
  Params: {
    roomId: string;
  };
  Querystring: {
    cursor: string;
    limit: string;
  };
}

interface SendMessageRequest {
  Params: {
    roomId: string;
  };
  Body: SendMessage;
}
interface ReadMessageRequest {
  Params: {
    roomId: string;
    messageId: string;
  };
}

interface MessageReactionRequest {
  Params: {
    messageId: string;
  };
  Body: {
    emoji: string;
    roomId: string;
  };
}

interface SendMessage {
  roomId: string;
  content: string;
  parentId?: string;
  attachmentIds?: string[];
}

type MessageStatus = "SENT" | "DELIVERED" | "READ";
interface MessageReadData {
  messageId: string;
  status: MessageStatus;
  roomId: string;
  userId: string;
}

interface MessageSender {
  id: string;
  name: string;
  avatar?: string | null;
}

interface MessageReaction {
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  emoji: string;
}

interface MessageAttachment {
  id: string;
  url: string; // Full URL to the file
  filename: string; // Original filename
  mimetype: string; // e.g., "image/png"
  size: number; // Bytes
  kind: FileKind; // "IMAGE", "FILE", or "VOICE"
  durationSec?: number | null; // Only for voice messages
}

interface MessageParent {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
}
interface MessageReceipt {
  userId: string;
  status: MessageStatus;
  updatedAt: Date;
}

interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited?: boolean;
  parentId?: string | null;
  parent?: MessageParent;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  status: MessageStatus;
  isOwn?: boolean;
  isRead?: boolean;
  tempId?: string;
  receipts: MessageReceipt[];
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
  emoji: string;
}

export type {
  GetMessageRequest,
  SendMessage,
  SendMessageRequest,
  MessageReceipt,
  MessageStatus,
  ReadMessageRequest,
  MessageReadData,
  Message,
  MessageReactionRequest,
  MessageReactionEventPayload,
};

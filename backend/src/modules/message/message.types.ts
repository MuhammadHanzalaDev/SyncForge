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

interface SendMessage {
  roomId: string;
  content: string;
  parentId?: string;
  attachmentIds?: string[];
}

type MessageStatus = "SENT" | "DELIVERED" | "READ";

interface MessageReceipt {
  messageId: string;
  userId: string;
  status: MessageStatus;
  updatedAt: Date;
}

interface MessageReadData {
  messageId: string;
  status: MessageStatus;
}

interface MessageSender {
  id: string;
  name: string;
  avatar?: string | null;
}

interface MessageReaction {
  id: string;
  userId: string;
  emoji: string;
}

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

interface MessageParent {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
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
  tempId?: string;
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
};

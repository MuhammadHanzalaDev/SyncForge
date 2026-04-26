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

export type {
  GetMessageRequest,
  SendMessage,
  SendMessageRequest,
  MessageReceipt,
  MessageStatus,
  ReadMessageRequest,
  MessageReadData,
};

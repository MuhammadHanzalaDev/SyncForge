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

export type {
  GetMessageRequest,
  SendMessage,
  SendMessageRequest,
  MessageReceipt,
  MessageStatus,
};

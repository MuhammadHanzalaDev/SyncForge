interface SendMessage {
  roomId: string;
  senderId: string;
  content: string;
  parentId?: string;
  attachmentIds?: string[];
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

interface MessageReceipt {
  id: string;
  userId: string;
  status: "SENT" | "DELIVERED" | "READ";
  updatedAt: Date;
}

interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited?: boolean;
  parentId?: string;
  attachments?: string[];
  reactions?: MessageReaction[];
  receipts?: MessageReceipt[];
  isOwn?: boolean;
}

interface GetMessagesParams {
  cursor: string | null;
}

export type { Message, SendMessage, GetMessagesParams };

interface SendMessage {
  roomId: string;
  senderId: string;
  content: string;
  parentId?: string;
  attachmentIds?: string[];
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
  reactions?: { emoji: string; count: number; reacted: boolean }[];
  replyTo?: { id: string; senderName: string; content: string };
  attachments?: { type: "image" | "file"; name: string; url?: string }[];
  isOwn?: boolean;
}

export type { Message, SendMessage };

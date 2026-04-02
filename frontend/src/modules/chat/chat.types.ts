interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "busy" | "offline";
  role?: "admin" | "member";
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

export type { Member, Message };

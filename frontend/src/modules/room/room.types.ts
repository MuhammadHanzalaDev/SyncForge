interface Chat {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: string;
  status: "ONLINE" | "OFFLINE" | "BUSY" | "AWAY";
}
interface RoomMember {
  id: string;
  name: string;
  avatar?: string;
  status: "ONLINE" | "AWAY" | "BUSY" | "OFFLINE";
  role?: "admin" | "member";
}

interface Room {
  id: string;
  name: string;
  type: string;
  members: RoomMember[];
  lastMessage: string;
}

// Map<chatId, true> — presence in map = unread
// type UnreadMap = Record<string, boolean>;
// interface UnreadState {
//   chatId: string;           // or roomId
//   unreadCount: number;      // 0 means read
//   lastReadMessageId?: string;
//   lastReadAt?: string;      // ISO timestamp
//   hasMention?: boolean;     // for @mentions, different glow
// }

export type { Chat, Room, RoomMember };

import { InfiniteData } from "@tanstack/react-query";

interface Chat {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: string;
  status: "ONLINE" | "OFFLINE" | "BUSY" | "AWAY";
  hasUnread: boolean;
  hasMention: boolean;
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
  hasUnread: boolean;
  hasMention: boolean;
}

interface UnreadInfo {
  count: number;
  hasMention: boolean;
}

type ChatsAndRoomsData = {
  rooms: Room[];
  chats: Chat[];
};

export type { Chat, Room, RoomMember, UnreadInfo, ChatsAndRoomsData };

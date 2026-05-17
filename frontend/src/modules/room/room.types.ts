import z from "zod";
import { createRoomSchema } from "./room.schema";

interface Chat {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: string;
  status: "ONLINE" | "OFFLINE" | "BUSY" | "AWAY";
  hasUnread: boolean;
  hasMention: boolean;
  roomId: string | null; // if the chat is not started yet, it won't have a roomId until the first message is sent
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

type RoomType = "PUBLIC" | "PRIVATE" | "DIRECT";

interface CreateRoomPayload {
  workspaceId: string;
  name: string;
  type: RoomType;
  memberIds?: string[];
}

type CreateRoomValues = z.infer<typeof createRoomSchema>;

export type {
  Chat,
  Room,
  RoomMember,
  UnreadInfo,
  ChatsAndRoomsData,
  RoomType,
  CreateRoomPayload,
  CreateRoomValues,
};

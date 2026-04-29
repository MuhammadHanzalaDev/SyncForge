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
}

interface UnreadInfo {
  count: number;
  hasMention: boolean;
}

export type { Chat, Room, RoomMember, UnreadInfo };

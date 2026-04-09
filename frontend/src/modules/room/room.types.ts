interface Chat {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: string;
  status: "ONLINE" | "OFFLINE" | "BUSY" | "AWAY";
}

interface Room {
  id: string;
  name: string;
  type: string;
  members: {
    id: string;
    firstName: true;
    lastName: true;
  };
  lastMessage: string;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "ONLINE" | "AWAY" | "BUSY" | "OFFLINE";
  role?: "admin" | "member";
}

export type { Chat, Room, Member };

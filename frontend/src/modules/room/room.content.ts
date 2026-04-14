import type { Member } from "./room.types";

const DUMMY_MEMBERS: Member[] = [
  { id: "1", name: "Alex Johnson", status: "ONLINE", role: "admin" },
  { id: "2", name: "Sarah Chen", status: "ONLINE", role: "member" },
  { id: "3", name: "Marcus Williams", status: "AWAY", role: "member" },
  { id: "4", name: "Priya Patel", status: "BUSY", role: "member" },
  { id: "5", name: "Tom Eriksson", status: "OFFLINE", role: "member" },
  { id: "6", name: "Layla Hassan", status: "ONLINE", role: "member" },
];


export { DUMMY_MEMBERS };

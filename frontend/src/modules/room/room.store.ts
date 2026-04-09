import { create } from "zustand";
import { Chat, Room } from "./room.types";

interface RoomState {
  roomId: string | null;
  setRoomId: (val: string | null) => void;
  activeChat: Chat | null;
  setActiveChat: (val: Chat | null) => void;
  activeRoom: Room | null;
  setActiveRoom: (val: Room | null) => void;
}

const useRoomStore = create<RoomState>((set) => ({
  roomId: "",
  setRoomId: (roomId) => set({ roomId }),
  activeChat: null,
  setActiveChat: (chat: Chat | null) => set({ activeChat: chat }),
  activeRoom: null,
  setActiveRoom: (room: Room | null) => set({ activeRoom: room }),
}));

export default useRoomStore;

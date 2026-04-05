import { create } from "zustand";

interface RoomState {
  roomId: string | null;
  setRoomId: (val: string | null) => void;
}

const useRoomStore = create<RoomState>((set) => ({
  roomId: "",
  setRoomId: (roomId) => set({ roomId }),
}));

export default useRoomStore;

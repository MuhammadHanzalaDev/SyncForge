import { create } from "zustand";

interface OnlineUserState {
  onlineUsers: string[];
  setOnlineUsers: (users: string[]) => void;
  addOnlineUser: (user: string) => void;
  removeOnlineUser: (user: string) => void;
}

const useOnlineUserStore = create<OnlineUserState>((set) => ({
  onlineUsers: [],

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addOnlineUser: (user) =>
    set((state) => ({
      onlineUsers: [...state.onlineUsers, user],
    })),

  removeOnlineUser: (user) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((u) => u !== user),
    })),
}));

export default useOnlineUserStore;

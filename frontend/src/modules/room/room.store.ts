import { create } from "zustand";
import { Chat, Room, UnreadInfo } from "./room.types";

interface RoomState {
  roomId: string | null;
  setRoomId: (val: string | null) => void;
  activeChat: Chat | null;
  setActiveChat: (val: Chat | null) => void;
  activeRoom: Room | null;
  setActiveRoom: (val: Room | null) => void;

  // unread
  unread: Record<string, UnreadInfo>;
  hydrateUnread: (data: Record<string, UnreadInfo>) => void;
  incrementUnread: (chatId: string, isMention: boolean) => void;
  markRead: (chatId: string) => void;
}

const useRoomStore = create<RoomState>((set) => ({
  roomId: "",
  setRoomId: (roomId) => set({ roomId }),

  activeChat: null,
  setActiveChat: (chat) => set({ activeChat: chat }),

  activeRoom: null,
  setActiveRoom: (room) => set({ activeRoom: room }),

  unread: {},

  hydrateUnread: (data) => set({ unread: data }),

  incrementUnread: (chatId, isMention) =>
    set((state) => {
      const current = state.unread[chatId] ?? { count: 0, hasMention: false };
      return {
        unread: {
          ...state.unread,
          [chatId]: {
            count: current.count + 1,
            hasMention: current.hasMention || isMention,
          },
        },
      };
    }),

  markRead: (chatId) =>
    set((state) => {
      // micro-optimization: skip update if already read
      if (!state.unread[chatId]) return state;

      const { [chatId]: _removed, ...rest } = state.unread;
      return { unread: rest };
    }),
}));

export default useRoomStore;

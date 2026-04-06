import { create } from "zustand";
import { Chat } from "../workspace/workspace.types";

interface ChatState {
  activeChat: Chat | null;
  setActiveChat: (val: Chat | null) => void;
}

const useChatStore = create<ChatState>((set) => ({
  activeChat: null,
  setActiveChat: (chat: Chat | null) => set({ activeChat: chat }),
}));

export default useChatStore;

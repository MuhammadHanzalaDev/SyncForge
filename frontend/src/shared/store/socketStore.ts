import { create } from "zustand";
import { Socket } from "socket.io-client";
import { initializeSocketInstance } from "../lib/socket";

interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string, workspaceId: string) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (token, workspaceId) => {
    // Don't create duplicate connections
    const existing = get().socket;

    if (existing?.connected) return;

    const socket = initializeSocketInstance(token, workspaceId);

    socket.on("connect", () => set({ isConnected: true }));
    socket.on("disconnect", () => set({ isConnected: false }));
    socket.on("connect_error", (err) => {
      console.error("[socket error]", err);
      //   if (err.message === "TOKEN_EXPIRED" || err.message === "INVALID_TOKEN") {
      //     get().disconnect();
      //     // trigger your auth refresh logic here
      //   }
    });

    set({ socket });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null, isConnected: false });
  },
}));

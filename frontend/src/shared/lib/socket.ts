import { io, Socket } from "socket.io-client";
import env from "../config/env";

export function initializeSocketInstance(
  token: string,
  workspaceId: string,
): Socket {
  const socket = io(env.NEXT_PUBLIC_SERVER_URL, {
    auth: { token, workspaceId },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  return socket;
}

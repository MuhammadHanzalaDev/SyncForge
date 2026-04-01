import { io, Socket } from "socket.io-client";
import env from "../config/env";

export function getSocketInstance(token: string): Socket {
  const socket = io(env.NEXT_PUBLIC_SERVER_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  return socket;
}

// export function disconnectSocket() {
//   socket?.disconnect();
//   socket = null;
// }

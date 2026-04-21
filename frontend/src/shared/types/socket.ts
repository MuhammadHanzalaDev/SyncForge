import { Socket } from "socket.io-client";

type SocketAuth = {
  token: string;
  workspaceId?: string;
};

interface CustomSocket extends Socket {
  auth: SocketAuth;
}

export type { CustomSocket };

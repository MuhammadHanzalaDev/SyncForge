import type { SocketUser } from "./socket";

declare module "socket.io" {
  interface Socket {
    user: SocketUser;
  }
}

import { Socket } from "socket.io";
import { verifyAccessToken } from "@/modules/auth/auth.utils";
import { AuthJwtPayload } from "@/modules/auth/auth.types";
import { SocketUser } from "@/types/socket";

declare module "socket.io" {
  interface Socket {
    user: SocketUser;
  }
}

const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const token = socket.handshake.auth?.token;
    const workspaceId = socket.handshake.auth?.workspaceId;

    if (!token) {
      return next(new Error("No Token"));
    }

    const decoded = verifyAccessToken(token) as AuthJwtPayload;

    if (typeof decoded === "string" || !decoded.userId) {
      return next(new Error("Invalid Token Payload"));
    }

    // attach user to socket
    socket.user = { userId: decoded.userId, workspaceId };

    next();
  } catch (err) {
    console.log("Socket Auth failed", err);
    return next(new Error("Invalid Token"));
  }
};

export default authenticateSocket;

import { Socket } from "socket.io";
import { verifyAccessToken } from "@/modules/auth/auth.utils";
import { AuthJwtPayload } from "@/modules/auth/auth.types";

declare module "socket.io" {
  interface Socket {
    user?: any;
  }
}

const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("No Token"));
    }

    const decoded = verifyAccessToken(token) as AuthJwtPayload;

    if (typeof decoded === "string" || !decoded.userId) {
      return next(new Error("Invalid Token Payload"));
    }

    // attach user to socket
    socket.user = { userId: decoded.userId };

    next();
  } catch (err) {
    return next(new Error("Invalid Token"));
  }
};

export default authenticateSocket;

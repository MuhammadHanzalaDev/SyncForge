import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env";
import registerEvents from "@/socket";
import authenticateSocket from "@/socket/socketAuth";
import { userOffline, userOnline } from "@/modules/user/user.service";

let io: Server;
const onlineUsers = new Map<string, Set<string>>();

export function initSocket(server: HttpServer) {
  // create io
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  // authenticate user
  io.use(authenticateSocket);

  // connect user
  io.on("connection", async (socket) => {
    try {
      const { userId, workspaceId } = socket.user;

      if (!userId || !workspaceId) return;

      // ALWAYS join workspace
      socket.join(workspaceId);

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      const userSockets = onlineUsers.get(userId)!;
      userSockets.add(socket.id);
      console.log("socket connected");

      // send current online users
      socket.emit("user:online-list", Array.from(onlineUsers.keys()));

      // first connection → online
      if (userSockets.size === 1) {
        await userOnline(socket.user);

        socket.to(workspaceId).emit("user:online", { userId });
      }
    } catch (error) {
      console.log("user online error: ", error);
    }

    // register events
    registerEvents(socket);

    // disconnect user
    socket.on("disconnect", async () => {
      try {
        const { userId, workspaceId } = socket.user;

        const userSockets = onlineUsers.get(userId);
        if (!userSockets) return;

        userSockets.delete(socket.id);
        console.log("socket disconnected");

        // make user offline if no more active connections
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);

          await userOffline(socket.user);

          socket.to(workspaceId).emit("user:offline", { userId });
        }
      } catch (error) {
        console.log("user offline error: ", error);
      }
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}

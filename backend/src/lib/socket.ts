import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env";
import registerEvents from "@/socket";
import authenticateSocket from "@/socket/socketAuth";
import { userOffline, userOnline } from "@/modules/user/user.service";
import { users, getUserStatusList } from "@/socket/socketStore";

let io: Server;

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

      if (!users.has(userId)) {
        users.set(userId, {
          sockets: new Set(),
          status: "ONLINE", // default
        });
      }

      const userData = users.get(userId)!;
      userData.sockets.add(socket.id);
      console.log("socket connected");

      // send current users statuses
      socket.emit("user:status-list", getUserStatusList());

      // first connection → online
      if (userData.sockets.size === 1) {
        userData.status = "ONLINE";

        await userOnline(socket.user);

        socket.to(workspaceId).emit("user:status", {
          userId,
          status: "ONLINE",
        });
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

        const userData = users.get(userId);
        if (!userData) return;

        userData.sockets.delete(socket.id);
        console.log("socket disconnected");

        // make user offline if no more active connections
        if (userData.sockets.size === 0) {
          users.delete(userId);

          await userOffline(socket.user);

          socket.to(workspaceId).emit("user:status", {
            userId,
            status: "OFFLINE",
          });
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

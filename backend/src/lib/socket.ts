import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env";
import registerEvents from "@/socket";
import authenticateSocket from "@/socket/socketAuth";

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
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // register events
    registerEvents(socket);

    // disconnect user
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}

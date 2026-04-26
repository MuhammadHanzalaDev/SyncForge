import { Socket } from "socket.io";
import { createMessageService } from "./message.service";
import { getIO } from "@/lib/socket";
import { MessageStatus } from "@prisma/client";
import { MessageReadData } from "./message.types";

function registerMessageEvents(socket: Socket) {
  socket.on("message:send", async (payload) => {
    const io = getIO();
    const message = await createMessageService(payload);

    // emit to room
    io.to(payload.roomId).emit("message:new", message);
  });
}

function registerTypingEvents(socket: Socket) {
  socket.on("typing:start", ({ roomId }) => {
    const userId = socket.handshake?.auth?.userId;
    socket.to(roomId).emit("typing:start", {
      userId,
    });
  });

  socket.on("typing:stop", ({ roomId }) => {
    const userId = socket.handshake?.auth?.userId;
    socket.to(roomId).emit("typing:stop", {
      userId,
    });
  });
}

const emitMessageRead = (roomId: string, data: MessageReadData) => {
  const io = getIO();
  io.to(roomId).emit("message:read", data);
};

export { registerMessageEvents, registerTypingEvents, emitMessageRead };

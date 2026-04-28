import { Socket } from "socket.io";
import { createMessageService } from "./message.service";
import { getIO } from "@/lib/socket";
import { Message, MessageReadData } from "./message.types";

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

const emitMessageRead = (data: MessageReadData, memberIds: string[]) => {
  const io = getIO();
  const rooms = memberIds.map((id) => `user:${id}`);
  io.to(rooms).emit("message:read", data);
};

const emitMessageReceived = (
  message: Message,
  memberIds: string[],
  roomId: string,
) => {
  const io = getIO();
  const rooms = memberIds.map((id) => `user:${id}`);
  io.to(rooms).emit("message:new", { message, roomId });
};

export {
  registerMessageEvents,
  registerTypingEvents,
  emitMessageRead,
  emitMessageReceived,
};

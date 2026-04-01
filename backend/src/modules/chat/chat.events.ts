import { Socket } from "socket.io";

function registerChatEvents(socket: Socket) {
  socket.on("message:send", async (payload) => {
    // emit to room
    socket.to(payload.roomId).emit("message:new", {});

    // also send back to sender
    socket.emit("message:new", {});
  });
}

export default registerChatEvents;

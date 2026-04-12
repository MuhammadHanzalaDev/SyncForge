import { Socket } from "socket.io";
import { createMessageService } from "./message.service";
import { getIO } from "@/lib/socket";

function registerMessageEvents(socket: Socket) {
  socket.on("message:send", async (payload) => {
    const io = getIO();
    const message = await createMessageService(payload);

    // emit to room
    io.to(payload.roomId).emit("message:new", message);
  });
}

export default registerMessageEvents;

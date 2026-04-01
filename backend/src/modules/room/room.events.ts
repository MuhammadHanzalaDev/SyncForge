import { Socket } from "socket.io";

function registerRoomEvents(socket: Socket) {
  socket.on("room:join", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("room:leave", (roomId: string) => {
    socket.leave(roomId);
  });
}

export default registerRoomEvents;

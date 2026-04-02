import { Socket } from "socket.io";

function registerRoomEvents(socket: Socket) {
  socket.on("room:join", (roomId: string) => {
    console.log("roomId: joined", roomId);
    socket.join(roomId);
  });

  socket.on("room:leave", (roomId: string) => {
    console.log("roomId: leaved", roomId);
    socket.leave(roomId);
  });
}

export default registerRoomEvents;

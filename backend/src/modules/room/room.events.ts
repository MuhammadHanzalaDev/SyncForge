import { Socket } from "socket.io";
import { JoinDirectRoom, JoinRoom } from "./room.types";
import { joinDirectRoomService, joinRoomService } from "./room.service";
import { socketHandler } from "@/utils/Error";

function registerRoomEvents(socket: Socket) {
  socket.on(
    "room:direct-join",
    socketHandler(async (data: JoinDirectRoom) => {
      const roomId = await joinDirectRoomService(
        data.workspaceId,
        data.targetUserId,
        socket?.user?.userId || "",
      );

      socket.join(roomId);
      console.log("room joined", roomId);

      socket.emit("room:direct-joined", { roomId });
    }),
  );

  socket.on(
    "room:join",
    socketHandler(async (data: JoinRoom) => {
      const roomId = await joinRoomService(data.workspaceId, data.roomId);

      socket.join(roomId);
      console.log("room joined", roomId);

      socket.emit("room:joined", { roomId });
    }),
  );

  socket.on("room:leave", (roomId: string) => {
    console.log("room leaved", roomId);
    socket.leave(roomId);
  });
}

export default registerRoomEvents;

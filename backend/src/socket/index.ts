import registerMessageEvents from "@/modules/message/message.events";
import registerRoomEvents from "@/modules/room/room.events";
import { Socket } from "socket.io";

export default function registerEvents(socket: Socket) {
  registerMessageEvents(socket);
  registerRoomEvents(socket);
}

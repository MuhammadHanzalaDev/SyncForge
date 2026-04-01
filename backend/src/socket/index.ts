import registerChatEvents from "@/modules/chat/chat.events";
import registerRoomEvents from "@/modules/room/room.events";
import { Socket } from "socket.io";

export default function registerEvents(socket: Socket) {
  registerChatEvents(socket);
  registerRoomEvents(socket);
}

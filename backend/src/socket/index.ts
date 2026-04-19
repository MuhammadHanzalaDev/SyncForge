import {
  registerMessageEvents,
  registerTypingEvents,
} from "@/modules/message/message.events";
import registerRoomEvents from "@/modules/room/room.events";
import { Socket } from "socket.io";

export default function registerEvents(socket: Socket) {
  registerRoomEvents(socket);
  registerMessageEvents(socket);
  registerTypingEvents(socket);
}

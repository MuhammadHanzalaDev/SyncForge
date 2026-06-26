import { Socket } from "socket.io";
import {
  registerMessageEvents,
  registerTypingEvents,
} from "@/modules/message/message.events";
import registerRoomEvents from "@/modules/room/room.events";
import { registerCallEvents } from "@/modules/call/call.events";

export default function registerEvents(socket: Socket) {
  registerRoomEvents(socket);
  registerMessageEvents(socket);
  registerTypingEvents(socket);
  registerCallEvents(socket);
}

import useSocketEmit from "@/shared/hooks/useSocketEmit";
import useSocketEvent from "@/shared/hooks/useSocketEvent";
import { SendMessage } from "../message.types";

export default function useMessageSocket() {
  const emit = useSocketEmit();

  const handleNewMessage = (message) => {
    console.log("new message received: ", message);
  };

  const sendMessage = (payload: SendMessage) => {
    emit("message:send", payload);
  };

  // events
  useSocketEvent("message:new", handleNewMessage);

  return { sendMessage };
}

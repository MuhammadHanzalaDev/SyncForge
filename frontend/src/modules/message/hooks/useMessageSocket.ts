import useSocketEmit from "@/shared/hooks/useSocketEmit";
import useSocketEvent from "@/shared/hooks/useSocketEvent";
import { Message, SendMessage } from "../message.types";
import { useQueryClient } from "@tanstack/react-query";

export default function useMessageSocket(roomId: string | null) {
  const emit = useSocketEmit();
  const queryClient = useQueryClient();

  const handleNewMessage = (message: Message) => {
    console.log("new message received: ", message);
    queryClient.setQueryData(["messages", roomId], (oldData: any) => {
      if (!oldData) {
        return {
          pages: [
            {
              data: [message],
              nextCursor: null,
            },
          ],
          pageParams: [null],
        };
      }

      const pages = [...oldData.pages];

      // append message to FIRST page (latest messages)
      pages[0] = {
        ...pages[0],
        data: [...pages[0].data, message],
      };

      return {
        ...oldData,
        pages,
      };
    });
  };

  const sendMessage = (payload: SendMessage) => {
    emit("message:send", payload);
  };

  // events
  useSocketEvent("message:new", handleNewMessage);

  return { sendMessage };
}

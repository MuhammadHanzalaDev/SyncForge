import useSocketEmit from "@/shared/hooks/useSocketEmit";
import useSocketEvent from "@/shared/hooks/useSocketEvent";
import { Message, SendMessage } from "../message.types";
import { useQueryClient } from "@tanstack/react-query";
import { usePersonalInfo } from "@/modules/user/user.query";

export default function useMessageSocket(roomId: string | null) {
  const emit = useSocketEmit();
  const queryClient = useQueryClient();
  const { data: personalInfo } = usePersonalInfo();

  const handleNewMessage = (message: Message) => {
    console.log("new message received: ", message);
    const formattedMsg: Message = {
      ...message,
      isOwn: message.sender.id === personalInfo?.id,
    };
    queryClient.setQueryData(["messages", roomId], (oldData: any) => {
      if (!oldData) {
        return {
          pages: [
            {
              data: [formattedMsg],
              nextCursor: null,
            },
          ],
          pageParams: [null],
        };
      }

      console.log("oldData: ", oldData);

      const pages = [...oldData.pages];

      // append message to FIRST page (latest messages)
      pages[0] = {
        ...pages[0],
        data: [formattedMsg, ...pages[0].data],
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

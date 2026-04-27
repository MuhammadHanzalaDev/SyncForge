import useSocketEvent from "@/shared/hooks/useSocketEvent";
import {
  Message,
  MessageseData,
  MessageStatus,
  NewMessage,
} from "../message.types";
import { useQueryClient } from "@tanstack/react-query";

export default function useMessageSocket() {
  const queryClient = useQueryClient();

  const handleNewMessage = ({ message, roomId }: NewMessage) => {
    console.log("new message received: ", message);

    const formattedMsg: Message = {
      ...message,
    };

    queryClient.setQueryData<MessageseData>(["messages", roomId], (oldData) => {
      console.log("pages before: ", oldData?.pages);

      if (!oldData) return;

      // If this message has a tempId, try to replace the optimistic one
      if (message.tempId) {
        const pages = oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((m) =>
            m.id === message.tempId ? formattedMsg : m,
          ),
        }));
        console.log("pages after temp id found: ", pages);

        // Check if replacement happened
        const replaced = pages.some((p, i) =>
          p.data.some((m, j) => m.id !== oldData.pages[i].data[j].id),
        );

        if (replaced) return { ...oldData, pages };
      }

      // Duplicate check — message already in cache, do nothing
      const exists = oldData.pages.some((p) =>
        p.data.some((m) => m.id === message.id),
      );
      if (exists) return oldData;

      // Otherwise prepend as a new message
      const pages = [...oldData.pages];
      pages[0] = { ...pages[0], data: [formattedMsg, ...pages[0].data] };
      console.log("pages after temp id not found: ", pages);
      return { ...oldData, pages };
    });
  };

  const handleMessageRead = ({
    messageId,
    status,
    roomId,
  }: {
    messageId: string;
    status: MessageStatus;
    roomId: string;
  }) => {
    console.log("new message read: ", { messageId, status, roomId });

    queryClient.setQueryData<MessageseData>(["messages", roomId], (oldData) => {
      if (!oldData) return;

      // update status
      const pages = oldData.pages.map((page) => ({
        ...page,
        data: page.data.map((m) => (m.id === messageId ? { ...m, status } : m)),
      }));

      // Check if replacement happened
      return { ...oldData, pages };
    });
  };

  // events
  useSocketEvent("message:new", handleNewMessage);
  useSocketEvent("message:read", handleMessageRead);
}

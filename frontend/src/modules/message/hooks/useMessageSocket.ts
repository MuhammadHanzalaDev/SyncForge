import useSocketEvent from "@/shared/hooks/useSocketEvent";
import useSocketEmit from "@/shared/hooks/useSocketEmit";
import { Message, MessageseData, MessageStatus } from "../message.types";
import { useQueryClient } from "@tanstack/react-query";
import { usePersonalInfo } from "@/modules/user/user.query";

export default function useMessageSocket(roomId: string | null) {
  const queryClient = useQueryClient();
  const { data: personalInfo } = usePersonalInfo();

  const handleNewMessage = (message: Message & { tempId?: string }) => {
    console.log("new message received: ", message);

    const formattedMsg: Message = {
      ...message,
      isOwn: message.sender.id === personalInfo?.id,
    };

    queryClient.setQueryData<MessageseData>(["messages", roomId], (oldData) => {
      console.log("pages before: ", oldData?.pages);

      if (!oldData) {
        return {
          pages: [{ data: [formattedMsg], nextCursor: null }],
          pageParams: [null],
        };
      }

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
  }: {
    messageId: string;
    status: MessageStatus;
  }) => {
    console.log("new message read: ", { messageId, status });

    queryClient.setQueryData<MessageseData>(["messages", roomId], (oldData) => {
      if (!oldData) {
        return;
      }

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

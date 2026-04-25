import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "./message.api";
import { usePersonalInfo } from "../user/user.query";
import { Message, MessageseData } from "./message.types";

const useSendMessage = (roomId: string | null) => {
  const queryClient = useQueryClient();
  const { data: personalInfo } = usePersonalInfo();

  return useMutation({
    mutationFn: sendMessage,

    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", roomId],
      });

      const previous = queryClient.getQueryData<MessageseData>([
        "messages",
        roomId,
      ]);

      const newMsg: Message = {
        id:
          newMessage.tempId ||
          `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        sender: {
          id: personalInfo?.id || "",
          name: `${personalInfo?.firstName} ${personalInfo?.lastName}`,
          avatar: personalInfo?.avatar,
        },
        content: newMessage.content,
        createdAt: new Date(),
        isOwn: true,
        tempAttachments: newMessage.attachments,
        status: "SENT",
      };

      queryClient.setQueryData<MessageseData>(
        ["messages", roomId],
        (oldData) => {
          if (!oldData) {
            return {
              pages: [{ data: [newMsg], nextCursor: null }],
              pageParams: [null],
            };
          }

          const pages = [...oldData.pages];

          pages[0] = {
            ...pages[0],
            data: [newMsg, ...pages[0].data],
          };

          return {
            ...oldData,
            pages,
          };
        },
      );

      return { previous };
    },

    onError: (_err, _newMessage, context) => {
      queryClient.setQueryData(["messages", roomId], context?.previous);
    },
  });
};

export { useSendMessage };

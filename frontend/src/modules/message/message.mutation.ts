import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "./message.api";
import { usePersonalInfo } from "../user/user.query";
import { Message } from "./message.types";

const useSendMessage = (roomId: string | null) => {
  const queryClient = useQueryClient();
  const { data: personalInfo } = usePersonalInfo();

  return useMutation({
    mutationFn: sendMessage,

    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", roomId],
      });

      const previous = queryClient.getQueryData(["messages", roomId]);

      const newMsg: Message = {
        id: `local-${Date.now()}`,
        sender: {
          id: personalInfo?.id || "",
          name: `${personalInfo?.firstName} ${personalInfo?.lastName}`,
          avatar: personalInfo?.avatar,
        },
        content: newMessage.content,
        createdAt: new Date(),
        isOwn: true,
      };

      queryClient.setQueryData(["messages", roomId], (oldData: any) => {
        if (!oldData) return oldData;

        const pages = [...oldData.pages];

        pages[0] = {
          ...pages[0],
          data: [...pages[0].data, newMsg],
        };

        return {
          ...oldData,
          pages,
        };
      });

      return { previous };
    },

    onError: (_err, _newMessage, context) => {
      queryClient.setQueryData(["messages", roomId], context?.previous);
    },
  });
};

export { useSendMessage };

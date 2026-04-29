import { QueryClient } from "@tanstack/react-query";
import { Message, MessageStatus, MessageseData } from "./message.types";

export const addMessage = (
  queryClient: QueryClient,
  roomId: string,
  message: Message,
): void => {
  queryClient.setQueryData<MessageseData>(["messages", roomId], (old) => {
    if (!old) return old;

    if (message.tempId) {
      const tempPageIdx = old.pages.findIndex((p) =>
        p.data.some((m) => m.id === message.tempId),
      );
      if (tempPageIdx !== -1) {
        const pages = [...old.pages];
        pages[tempPageIdx] = {
          ...pages[tempPageIdx],
          data: pages[tempPageIdx].data.map((m) =>
            m.id === message.tempId ? message : m,
          ),
        };
        return { ...old, pages };
      }
    }

    const exists = old.pages.some((p) =>
      p.data.some((m) => m.id === message.id),
    );
    if (exists) return old;

    const pages = [...old.pages];
    pages[0] = { ...pages[0], data: [message, ...pages[0].data] };
    return { ...old, pages };
  });
};

export const updateMessageStatus = (
  queryClient: QueryClient,
  roomId: string,
  messageId: string,
  status: MessageStatus,
): void => {
  queryClient.setQueryData<MessageseData>(["messages", roomId], (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.map((m) => (m.id === messageId ? { ...m, status } : m)),
      })),
    };
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactMessage, readMessage, sendMessage } from "./message.api";
import { usePersonalInfo } from "../user/user.query";
import {
  Message,
  MessageReactionAction,
  MessagesData,
  ReactMessage,
} from "./message.types";
import { updateMessageReaction } from "./message.cache";

const useSendMessage = (roomId: string | null) => {
  const queryClient = useQueryClient();
  const { data: personalInfo } = usePersonalInfo();

  return useMutation({
    mutationFn: sendMessage,

    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", roomId],
      });

      const previous = queryClient.getQueryData<MessagesData>([
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
        parentId: newMessage.parentId,
        parent: newMessage.parent,
      };

      queryClient.setQueryData<MessagesData>(
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

const useReadMessage = () => {
  return useMutation({
    mutationFn: readMessage,
  });
};

const useReactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactMessage,

    onMutate: async (data: ReactMessage) => {
      // cancel in-flight fetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["messages", data.roomId] });

      // snapshot for rollback
      const previous = queryClient.getQueryData<MessagesData>([
        "messages",
        data.roomId,
      ]);

      // figure out what action the server will take, based on current cache
      let action: MessageReactionAction = "added";

      if (previous) {
        for (const page of previous.pages) {
          const msg = page.data.find((m) => m.id === data.messageId);
          if (!msg) continue;
          const existing = msg.reactions?.find(
            (r) => r.user.id === data.user.id,
          );
          if (existing) {
            action = existing.emoji === data.emoji ? "removed" : "updated";
          }
          break;
        }
      }

      // reuse the same cache updater the socket uses
      updateMessageReaction(queryClient, {
        action,
        messageId: data.messageId || "",
        roomId: data.roomId,
        emoji: data.emoji,
        user: {
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        },
      });

      return { previous };
    },

    onError: (_err, vars, context) => {
      // rollback
      if (context?.previous) {
        queryClient.setQueryData(["messages", vars.roomId], context.previous);
      }
    },

    // no onSuccess needed — the socket event from the server will fire
    // updateMessageReaction with the authoritative state
  });
};
export { useSendMessage, useReadMessage, useReactMessage };

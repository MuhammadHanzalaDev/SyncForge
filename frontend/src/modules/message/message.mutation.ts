import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactMessage, readMessage, sendMessage } from "./message.api";
import { usePersonalInfo } from "../user/user.query";
import {
  Message,
  MessageReactionAction,
  MessagesData,
  ReactMessage,
  ReadMessage,
} from "./message.types";
import { updateMessageReaction } from "./message.cache";
import { Chat, ChatsAndRoomsData, Room } from "../room/room.types";
import useWorkspaceStore from "../workspace/workspace.store";

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
        receipts: [],
      };

      queryClient.setQueryData<MessagesData>(
        ["messages", roomId],
        (oldData) => {
          if (!oldData) {
            return {
              pages: [
                { data: [newMsg], nextCursor: null, lastReadAt: new Date() },
              ],
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readMessage,

    onMutate: async ({ roomId, messageId, messageCreatedAt }: ReadMessage) => {
      // stop overwrites
      await queryClient.cancelQueries({
        queryKey: ["messages", roomId],
      });

      // snapshot for rollback
      const previous = queryClient.getQueryData<MessagesData>([
        "messages",
        roomId,
      ]);

      // optimistic update
      queryClient.setQueryData<MessagesData>(
        ["messages", roomId],
        (oldData) => {
          if (!oldData) return oldData;

          const pages = [...oldData.pages];

          const current = pages[0]?.lastReadAt
            ? new Date(pages[0].lastReadAt).getTime()
            : 0;

          const incoming = new Date(messageCreatedAt).getTime();

          const shouldUpdate = incoming > current;

          pages[0] = {
            ...pages[0],
            lastReadAt: shouldUpdate ? messageCreatedAt : pages[0].lastReadAt,
            lastReadMessageId: shouldUpdate
              ? messageId
              : pages[0].lastReadMessageId,
          };

          return {
            ...oldData,
            pages,
          };
        },
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // rollback on failure
      if (context?.previous) {
        queryClient.setQueryData(["messages", _vars.roomId], context.previous);
      }
    },
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

    onError: (_err, data, context) => {
      // rollback
      if (context?.previous) {
        queryClient.setQueryData(["messages", data.roomId], context.previous);
      }
    },

    // no onSuccess needed — the socket event from the server will fire
    // updateMessageReaction with the authoritative state
  });
};
export { useSendMessage, useReadMessage, useReactMessage };

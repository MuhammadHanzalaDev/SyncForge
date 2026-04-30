import { QueryClient } from "@tanstack/react-query";
import { Message, MessageStatus, MessagesData } from "./message.types";
import { ChatsAndRoomsData } from "../room/room.types";

// Helper: update hasUnread for a given roomId across all workspace caches
const setUnreadFlag = (
  queryClient: QueryClient,
  roomId: string,
  hasUnread: boolean,
): void => {
  queryClient.setQueriesData<ChatsAndRoomsData>(
    { queryKey: ["chatsRooms"] },
    (old) => {
      if (!old) return old;

      let changed = false;

      const chats = old.chats.map((c) => {
        if (c.id === roomId && c.hasUnread !== hasUnread) {
          changed = true;
          return { ...c, hasUnread };
        }
        return c;
      });

      const rooms = old.rooms.map((r) => {
        if (r.id === roomId && r.hasUnread !== hasUnread) {
          changed = true;
          return { ...r, hasUnread };
        }
        return r;
      });

      return changed ? { ...old, chats, rooms } : old;
    },
  );
};

export const addMessage = (
  queryClient: QueryClient,
  roomId: string,
  message: Message,
  context?: {
    currentUserId?: string;
    activeRoomId?: string | null;
  },
): void => {
  queryClient.setQueryData<MessagesData>(["messages", roomId], (old) => {
    if (!old) return old;

    // Optimistic confirmation: replace temp message with real one
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

    // Dedupe
    const exists = old.pages.some((p) =>
      p.data.some((m) => m.id === message.id),
    );
    if (exists) return old;

    const pages = [...old.pages];
    pages[0] = { ...pages[0], data: [message, ...pages[0].data] };
    return { ...old, pages };
  });

  // Decide whether to flip hasUnread
  const isOwnMessage =
    context?.currentUserId && message.sender.id === context.currentUserId;
  const isActiveRoom = context?.activeRoomId === roomId;
  const isOptimisticReplace = !!message.tempId;

  if (!isOwnMessage && !isActiveRoom && !isOptimisticReplace) {
    setUnreadFlag(queryClient, roomId, true);
  }
};

export const updateMessageStatus = (
  queryClient: QueryClient,
  roomId: string,
  messageId: string,
  status: MessageStatus,
): void => {
  queryClient.setQueryData<MessagesData>(["messages", roomId], (old) => {
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

// Call this when the user opens/reads a room
export const markRoomAsRead = (
  queryClient: QueryClient,
  roomId: string,
): void => {
  setUnreadFlag(queryClient, roomId, false);
};

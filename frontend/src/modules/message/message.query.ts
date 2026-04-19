import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "./message.api";

const useMessages = (roomId?: string | null) => {
  return useInfiniteQuery({
    queryKey: ["messages", roomId],

    queryFn: ({ pageParam }) =>
      getMessages(roomId || null, {
        cursor: pageParam,
      }),

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? undefined;
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export { useMessages };

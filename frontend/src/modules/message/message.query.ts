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
  });
};

export { useMessages };

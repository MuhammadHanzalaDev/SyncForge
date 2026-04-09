import { useQuery } from "@tanstack/react-query";
import { getChatsAndRooms } from "./room.api";

const useChatsAndRooms = (workspaceId?: string | null) => {
  return useQuery({
    queryKey: ["chatsRooms", workspaceId],
    queryFn: () => getChatsAndRooms(workspaceId),
  });
};

export { useChatsAndRooms };

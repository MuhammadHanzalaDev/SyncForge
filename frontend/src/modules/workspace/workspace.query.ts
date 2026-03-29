import { useQuery } from "@tanstack/react-query";
import {
  getAllWorkspaces,
  getChatsAndRooms,
} from "./workspace.api";

const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
  });
};

const useChatsAndRooms = (workspaceId?: string | null) => {
  return useQuery({
    queryKey: ["chatsRooms", workspaceId],
    queryFn: () => getChatsAndRooms(workspaceId),
  });
};

export { useWorkspaces, useChatsAndRooms };

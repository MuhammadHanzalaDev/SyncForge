import { useQuery } from "@tanstack/react-query";
import {
  getAllWorkspaces,
  getChatsAndRooms,
  getPersonalInfo,
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

const usePersonalInfo = () => {
  return useQuery({
    queryKey: ["personalInfo"],
    queryFn: getPersonalInfo,
  });
};

export { useWorkspaces, useChatsAndRooms, usePersonalInfo };

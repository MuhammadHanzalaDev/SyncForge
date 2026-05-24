import { useQuery } from "@tanstack/react-query";
import {
  getAllWorkspaces,
  getAllWorkspaceMembersForFilters,
} from "./workspace.api";

const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
  });
};

const useGetMembersForFilters = (workspaceId?: string | null) => {
  return useQuery({
    queryKey: ["workspaceMembersForFilters", workspaceId],
    queryFn: () => getAllWorkspaceMembersForFilters(workspaceId),
  });
};

export { useWorkspaces, useGetMembersForFilters };

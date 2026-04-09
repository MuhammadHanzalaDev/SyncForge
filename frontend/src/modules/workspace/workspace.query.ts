import { useQuery } from "@tanstack/react-query";
import {
  getAllWorkspaces,
} from "./workspace.api";

const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
  });
};

export { useWorkspaces };

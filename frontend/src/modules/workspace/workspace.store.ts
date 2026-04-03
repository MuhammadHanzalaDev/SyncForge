import { getItem } from "@/shared/utils/localStorage";
import { create } from "zustand";

interface WorkspaceState {
  workspaceId: string | null;
  setWorkspaceId: (val: string | null) => void;
}

const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceId: getItem("workspace"),
  setWorkspaceId: (workspaceId) => set({ workspaceId }),
}));

export default useWorkspaceStore;

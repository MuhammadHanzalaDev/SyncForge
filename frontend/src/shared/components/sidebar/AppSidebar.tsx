"use client";

import { Sidebar } from "@/shared/components/ui/sidebar";
import { SidebarHeaderSection } from "./SidebarHeaderSection";
import { SidebarFooterSection } from "./SidebarFooterSection";
import { SidebarContentSection } from "./SidebarContentSection";
import {
  useWorkspaces,
  useChatsAndRooms,
} from "@/modules/workspace/workspace.query";
import { getItem } from "@/shared/utils/localStorage";

export function AppSidebar() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { data: chats, isLoading: chatsLoading } = useChatsAndRooms(
    getItem("workspace"),
  );

  return (
    <Sidebar>
      <SidebarHeaderSection
        workspaces={workspaces}
        workspacesLoading={isLoading}
        chats={chats}
        chatsLoading={chatsLoading}
      />
      <SidebarContentSection />
      <SidebarFooterSection />
    </Sidebar>
  );
}

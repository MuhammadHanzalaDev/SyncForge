"use client";

import { Sidebar } from "@/shared/components/ui/sidebar";
import { SidebarHeaderSection } from "./SidebarHeaderSection";
import { SidebarFooterSection } from "./SidebarFooterSection";
import { SidebarContentSection } from "./SidebarContentSection";
import { useWorkspaces } from "@/modules/workspace/workspace.query";

export function AppSidebar() {
  const { data: workspaces, isLoading } = useWorkspaces();

  return (
    <Sidebar>
      <SidebarHeaderSection
        workspaces={workspaces}
        workspacesLoading={isLoading}
      />
      <SidebarContentSection />
      <SidebarFooterSection />
    </Sidebar>
  );
}

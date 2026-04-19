"use client";

import { Sidebar } from "@/shared/components/ui/sidebar";
import { SidebarContentSection } from "./SidebarContentSection";

export function AppSidebar() {
  return (
    <Sidebar className="top-12">
      <SidebarContentSection />
    </Sidebar>
  );
}

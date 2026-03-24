import { Sidebar } from "@/shared/components/ui/sidebar";
import { SidebarHeaderSection } from "./SidebarHeaderSection";
import { SidebarFooterSection } from "./SidebarFooterSection";
import { SidebarContentSection } from "./SidebarContentSection";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeaderSection />
      <SidebarContentSection />
      <SidebarFooterSection />
    </Sidebar>
  );
}

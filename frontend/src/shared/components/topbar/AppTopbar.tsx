"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { SidebarTrigger } from "../ui/sidebar";
import ModeToggle from "../common/ModeToggle";
import { WorkspaceSection } from "./WorkspaceSection";
import ProfileSection from "./ProfileSection";
import { useWorkspaces } from "@/modules/workspace/workspace.query";
import { CustomInputFieldWithContent } from "..";

export default function TopBar() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const [searchQuery, setSearchQuery] = useState("");

  const notificationCount = 3; // wire up to your real notification store

  return (
    <header className="h-12 flex items-center justify-between px-4 border-b bg-background/95 backdrop-blur-sm shrink-0 gap-4 z-50">
      {/* ── Left: Logo / App name ── */}
      <div className="flex items-center gap-2 shrink-0">
        <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground" />

        <WorkspaceSection
          workspaces={workspaces}
          workspacesLoading={isLoading}
        />
      </div>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto">
        <CustomInputFieldWithContent
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          leftContent={
            <Search className="h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          }
        />
      </div>

      {/* ── Right: Actions + Profile ── */}
      <div className="flex items-center gap-3 shrink-0 w-48 justify-end">
        {/* Theme toggqle */}
        <ModeToggle />

        {/* Notifications */}

        <div className="relative inline-flex cursor-pointer">
          <Bell className="h-6 w-6 text-muted-foreground" />
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs bg-primary"
          >
            {notificationCount}
          </Badge>
        </div>

        {/* Profile dropdown */}
        <ProfileSection />
      </div>
    </header>
  );
}

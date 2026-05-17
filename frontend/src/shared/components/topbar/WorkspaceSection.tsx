"use client";

import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { ChevronsUpDown, MonitorCloud, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { UserAvatarGroup } from "..";
import { WorkspaceRes } from "@/modules/workspace/workspace.types";
import { getItem, setItem } from "@/shared/utils/localStorage";
import useWorkspaceStore from "@/modules/workspace/workspace.store";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface WorkspaceSectionProps {
  workspaces: WorkspaceRes[];
  workspacesLoading: boolean;
}

export function WorkspaceSection({
  workspaces,
  workspacesLoading,
}: WorkspaceSectionProps) {
  const router = useRouter();
  const setWorkspaceId = useWorkspaceStore((state) => state.setWorkspaceId);
  const [activeId, setActiveId] = useState(getItem("workspace"));
  const [open, setOpen] = useState(false);

  const activeItem = workspaces?.find((i) => i.id === activeId);

  useEffect(() => {
    setItem("workspace", activeId || "");
    setWorkspaceId(activeId || "");
    router.replace("/");
  }, [activeId]);

  return (
    <div>
      {workspacesLoading ? (
        <div>Loading...</div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
              )}
            >
              {/* Active workspace icon */}
              {activeItem?.logo ? (
                <div className="h-10 w-10 relative rounded-lg shrink-0">
                  <Image
                    src={activeItem.logo}
                    alt="logo"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shrink-0">
                  <MonitorCloud className="h-4 w-4" />
                </div>
              )}

              {/* Name + plan */}
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sm">
                  {activeItem?.name}
                </span>
                <span className="text-xs text-muted-foreground">Workspace</span>
              </div>

              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
            </SidebarMenuButton>
          </PopoverTrigger>

          {/* Teams popover — positioned to the right like the screenshot */}
          <PopoverContent
            side="right"
            align="start"
            sideOffset={8}
            className="w-64 p-1"
          >
            {/* Section label */}
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Workspaces
            </p>

            {/* Team list */}
            <div className="flex flex-col gap-0.5">
              {workspaces?.map((team) => (
                <button
                  key={team.name}
                  onClick={() => {
                    setActiveId(team.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeItem?.name === team.name &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background shrink-0">
                    <MonitorCloud className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-left font-medium">
                    {team.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    <UserAvatarGroup
                      count={team.totalMembers}
                      className="w-5 h-5"
                    />
                  </span>
                </button>
              ))}
            </div>

            {/* Divider + Add team */}
            <div className="mt-1 border-t border-border pt-1">
              <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-border shrink-0">
                  <Plus className="h-4 w-4" />
                </div>
                <span>Add Workspace</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

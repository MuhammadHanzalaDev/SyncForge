"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/shared/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../ui/avatar";
import { useChatsAndRooms } from "@/modules/workspace/workspace.query";
import { getItem } from "@/shared/utils/localStorage";
import sidebarItems from "../content/sidebar";
import { Chat, Room } from "@/modules/workspace/workspace.types";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  icon: React.ElementType;
  children?: Chat[] | Room[];
  isIcons?: boolean;
  onChildClick?: (id: string) => void;
}

function CollapsibleNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <div className="flex items-center gap-2">
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </div>
            <ChevronDown
              className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200"
              style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children!.map((child) => (
              <SidebarMenuSubItem
                key={child?.id}
                className="cursor-pointer"
                onClick={() => item?.onChildClick?.(child.id)}
              >
                <SidebarMenuSubButton className="pl-8 text-sm text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-md px-2 py-1.5">
                  {item.isIcons ? (
                    <div className="flex gap-2">
                      <div>
                        <Avatar
                          size="sm"
                          className="bg-primary text-white w-5 h-5 flex justify-center items-center text-xs"
                        >
                          {child?.name?.slice(0, 1)}
                        </Avatar>
                      </div>
                      <div>{child.name}</div>
                    </div>
                  ) : (
                    child.name
                  )}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function SidebarContentSection() {
  const router = useRouter();
  const { data, isLoading } = useChatsAndRooms(getItem("workspace"));
  const items = sidebarItems.map((item) =>
    item.label === "Chats"
      ? {
          ...item,
          children: data?.chats || [],
          onChildClick: (id: string) => router.push(`/chats/${id}`),
        }
      : item.label === "Rooms"
        ? {
            ...item,
            children: data?.rooms || [],
            onChildClick: (id: string) => router.push(`/chats/${id}`),
          }
        : item,
  );

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 mb-1">
          Platform
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <CollapsibleNavItem key={item.label} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

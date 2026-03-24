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
import {
  BookOpen,
  Settings2,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Avatar } from "../ui/avatar";

interface NavItem {
  label: string;
  icon: React.ElementType;
  children?: string[];
  isIcons?: boolean;
}

const platformItems: NavItem[] = [
  {
    label: "Chats",
    icon: MessageCircle,
    children: ["Chat 1", "Chat 2", "Chat 3"],
    isIcons: true,
  },
  {
    label: "Rooms",
    icon: UsersRound,
    children: ["Room 1", "Room 2", "Room 3"],
    isIcons: true,
  },
  {
    label: "Documentation",
    icon: BookOpen,
    children: ["Introduction"],
    isIcons: false,
  },
  {
    label: "Settings",
    icon: Settings2,
    // no children
  },
];

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
              <SidebarMenuSubItem key={child} className="cursor-pointer">
                <SidebarMenuSubButton className="pl-8 text-sm text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-md px-2 py-1.5">
                  {item.isIcons ? (
                    <div className="flex gap-2">
                      <div>
                        <Avatar
                          size="sm"
                          className="bg-primary text-white w-5 h-5 flex justify-center items-center text-xs"
                        >
                          {child?.slice(0, 1)}
                        </Avatar>
                      </div>
                      <div>{child}</div>
                    </div>
                  ) : (
                    child
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
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 mb-1">
          Platform
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {platformItems.map((item) => (
              <CollapsibleNavItem key={item.label} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

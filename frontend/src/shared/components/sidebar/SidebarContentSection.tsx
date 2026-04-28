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
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  ChevronRight,
  ChevronDown,
  MessageCirclePlus,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChatsAndRooms } from "@/modules/room/room.query";
import sidebarItems from "../content/sidebar";
import { Chat, Room } from "@/modules/room/room.types";
import { useRouter } from "next/navigation";
import CustomButton from "../form/CustomButtom";
import useWorkspaceStore from "@/modules/workspace/workspace.store";
import StatusDot from "@/modules/room/components/StatusDot";
import useRoomStore from "@/modules/room/room.store";
import useUserStatusStore from "@/shared/store/userStatusStore";
import { cn } from "@/shared/lib/utils";

interface NavItemBase {
  label: string;
  icon: React.ElementType;
  isIcons?: boolean;
}
interface ChatNavItem extends NavItemBase {
  label: "Chats";
  children: Chat[];
  onChildClick?: (chat: Chat) => void;
}

interface RoomNavItem extends NavItemBase {
  label: "Rooms";
  children: Room[];
  onChildClick?: (room: Room) => void;
}

type NavItem = ChatNavItem | RoomNavItem;

function CollapsibleNavItem({
  item,
  activeItem,
}: {
  item: NavItem;
  activeItem: string;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const getUserStatus = useUserStatusStore((state) => state.getUserStatus);

  if (!hasChildren && item.label !== "Rooms") {
    const isActive = activeItem === item.label;
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
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
            {item.label === "Chats" && (
              <>
                {item.children!.map((child) => {
                  const isActive = activeItem === child.id;
                  return (
                    <SidebarMenuSubItem
                      key={child?.id}
                      className="cursor-pointer group/item relative"
                      onClick={() => item?.onChildClick?.(child)}
                    >
                      <SidebarMenuSubButton
                        className={cn(
                          "pl-8 pr-8 text-sm rounded-md py-1.5 transition-colors relative w-full",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-0.5 before:bg-primary before:rounded-r"
                            : "text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                        )}
                      >
                        {item.isIcons ? (
                          <div className="flex gap-2 items-center min-w-0">
                            <div className="relative shrink-0">
                              <Avatar size="sm" className="w-5 h-5">
                                {child?.avatar ? (
                                  <AvatarImage
                                    src={child?.avatar}
                                    alt={child?.name}
                                  />
                                ) : (
                                  <AvatarFallback className="bg-primary text-white flex justify-center items-center text-xs">
                                    {child?.name?.slice(0, 1)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <StatusDot status={getUserStatus(child.id)} />
                            </div>
                            <div className="truncate">{child.name}</div>
                          </div>
                        ) : (
                          <span className="truncate">{child.name}</span>
                        )}
                      </SidebarMenuSubButton>

                      {/* Hover actions */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // your menu open logic here
                        }}
                        className={cn(
                          "absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded flex items-center justify-center transition-opacity",
                          "hover:bg-sidebar-accent-foreground/10",
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover/item:opacity-100 focus:opacity-100",
                        )}
                        aria-label={`Options for ${child.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </SidebarMenuSubItem>
                  );
                })}
                <SidebarMenuSubItem
                  className="cursor-pointer"
                  onClick={() => {}}
                >
                  <CustomButton
                    variant="outline"
                    size="sm"
                    className="w-100 text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  >
                    <MessageCirclePlus /> New Chat
                  </CustomButton>
                </SidebarMenuSubItem>
              </>
            )}

            {item.label === "Rooms" && (
              <SidebarMenuSubItem className="cursor-pointer" onClick={() => {}}>
                <CustomButton
                  variant="outline"
                  size="sm"
                  className="w-100 text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                >
                  <Plus /> Create Room
                </CustomButton>
              </SidebarMenuSubItem>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function SidebarContentSection() {
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const workspaceId = useWorkspaceStore((state) => state.workspaceId);
  const { data } = useChatsAndRooms(workspaceId);
  const setActiveChat = useRoomStore((state) => state.setActiveChat);
  const [activeItem, setActiveItem] = useState("");

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const items: NavItem[] = sidebarItems.map((item) =>
    item.label === "Chats"
      ? {
          ...item,
          label: "Chats",
          children: data?.chats || [],
          onChildClick: (chat: Chat) => {
            setActiveChat(chat);
            setActiveItem(chat.id);
            router.push(`/chats/${chat.id}`);
            closeMobile();
          },
        }
      : item.label === "Rooms"
        ? {
            ...item,
            label: "Rooms",
            children: data?.rooms || [],
            oonChildClick: (room: Room) => {
              setActiveItem(room.id);
              router.push(`/chats/${room.id}`);
              closeMobile();
            },
          }
        : (item as NavItem),
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
              <CollapsibleNavItem
                key={item.label}
                item={item}
                activeItem={activeItem}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

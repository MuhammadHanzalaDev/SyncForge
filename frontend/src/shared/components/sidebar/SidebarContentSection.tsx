"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { useState } from "react";
import { useChatsAndRooms } from "@/modules/room/room.query";
import sidebarItems from "../content/sidebar";
import { Chat, Room } from "@/modules/room/room.types";
import { useRouter } from "next/navigation";
import useWorkspaceStore from "@/modules/workspace/workspace.store";
import useRoomStore from "@/modules/room/room.store";
import CollapsibleNavItem from "./CollapsibleNavItem";
import { useQueryClient } from "@tanstack/react-query";
import { markRoomAsRead } from "@/modules/message/message.cache";

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
export type NavItem = ChatNavItem | RoomNavItem;

export function SidebarContentSection() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const workspaceId = useWorkspaceStore((state) => state.workspaceId);
  const { data } = useChatsAndRooms(workspaceId);
  const setActiveChat = useRoomStore((state) => state.setActiveChat);
  const setActiveRoom = useRoomStore((state) => state.setActiveRoom);
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
            markRoomAsRead(queryClient, chat.roomId!);
            router.push(`/chats/${chat.id}`);
            closeMobile();
          },
        }
      : item.label === "Rooms"
        ? {
            ...item,
            label: "Rooms",
            children: data?.rooms || [],
            onChildClick: (room: Room) => {
              setActiveRoom(room);
              setActiveItem(room.id);
              markRoomAsRead(queryClient, room.id);
              router.push(`/rooms/${room.id}`);
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

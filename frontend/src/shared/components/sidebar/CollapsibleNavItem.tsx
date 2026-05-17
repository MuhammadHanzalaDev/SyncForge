"use client";

import {
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
  ChevronRight,
  ChevronDown,
  MessageCirclePlus,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CustomButton from "../form/CustomButton";
import StatusDot from "@/modules/room/components/StatusDot";
import useUserStatusStore from "@/shared/store/userStatusStore";
import { cn } from "@/shared/lib/utils";
import { NavItem } from "./SidebarContentSection";
import CreateRoom from "@/modules/room/components/forms/CreateRoom";

export default function CollapsibleNavItem({
  item,
  activeItem,
}: {
  item: NavItem;
  activeItem: string;
}) {
  const [open, setOpen] = useState(true);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
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
    <>
      {/* Create Room Modal */}
      <CreateRoom isOpen={isCreateRoomOpen} setIsOpen={setIsCreateRoomOpen} />

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
            <SidebarMenuSub className="mx-0 px-0 border-l-0">
              {item.label === "Chats" && (
                <>
                  {item.children!.map((child) => {
                    const isActive = activeItem === child.id;
                    const isUnread = !!child.hasUnread;
                    const hasMention = !!child.hasMention;

                    return (
                      <SidebarMenuSubItem
                        key={child.id}
                        className="cursor-pointer group/item relative"
                        onClick={() => item?.onChildClick?.(child)}
                      >
                        <SidebarMenuSubButton
                          className={cn(
                            // kill default pl-8, tighten row, leave room for 3-dot on right
                            "pl-2! pr-8 py-1.5 text-sm rounded-md transition-colors relative w-full h-8",
                            isActive
                              ? "bg-accent text-accent-foreground font-medium border-l-2 pl-1.5!"
                              : "text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                            // Teams-style bold for unread
                            isUnread &&
                              !isActive &&
                              "text-foreground font-semibold",
                          )}
                          style={
                            isActive
                              ? { borderColor: "oklch(0.54 0.29 264)" }
                              : {}
                          }
                        >
                          {item.isIcons ? (
                            <div className="flex items-center gap-2 min-w-0 w-full">
                              <div className="relative shrink-0">
                                <Avatar size="sm" className="w-6 h-6">
                                  {child?.avatar ? (
                                    <AvatarImage
                                      src={child.avatar}
                                      alt={child.name}
                                    />
                                  ) : (
                                    <AvatarFallback className="bg-primary text-white flex justify-center items-center text-xs">
                                      {child?.name?.slice(0, 1)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <StatusDot status={getUserStatus(child.id)} />
                              </div>

                              <span className="truncate flex-1 min-w-0">
                                {child.name}
                              </span>

                              {/* Unread / mention dot — Teams style */}
                              {isUnread && (
                                <span
                                  style={{
                                    backgroundColor: hasMention
                                      ? "oklch(0.577 0.245 27.325)"
                                      : "oklch(0.54 0.29 264)",
                                    height: "8px",
                                    width: "8px",
                                    borderRadius: "9999px",
                                    flexShrink: 0,
                                  }}
                                  aria-label={
                                    hasMention ? "Unread mention" : "Unread"
                                  }
                                />
                              )}
                            </div>
                          ) : (
                            <span className="truncate">{child.name}</span>
                          )}
                        </SidebarMenuSubButton>

                        {/* 3-dot — hover only, even when active */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            // menu open logic
                          }}
                          className={cn(
                            "absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded flex items-center justify-center",
                            "opacity-0 group-hover/item:opacity-100 focus:opacity-100",
                            "hover:bg-sidebar-accent-foreground/10 transition-opacity",
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
                      className="w-full text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                    >
                      <MessageCirclePlus /> New Chat
                    </CustomButton>
                  </SidebarMenuSubItem>
                </>
              )}

              {item.label === "Rooms" && (
                <>
                  {item.children!.map((child) => {
                    const isActive = activeItem === child.id;
                    const isUnread = !!child.hasUnread;
                    const hasMention = !!child.hasMention;

                    return (
                      <SidebarMenuSubItem
                        key={child.id}
                        className="cursor-pointer group/item relative"
                        onClick={() => item?.onChildClick?.(child)}
                      >
                        <SidebarMenuSubButton
                          className={cn(
                            // kill default pl-8, tighten row, leave room for 3-dot on right
                            "pl-2! pr-8 py-1.5 text-sm rounded-md transition-colors relative w-full h-8",
                            isActive
                              ? "bg-accent text-accent-foreground font-medium border-l-2 pl-1.5!"
                              : "text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                            // Teams-style bold for unread
                            isUnread &&
                              !isActive &&
                              "text-foreground font-semibold",
                          )}
                          style={
                            isActive
                              ? { borderColor: "oklch(0.54 0.29 264)" }
                              : {}
                          }
                        >
                          <div className="flex items-center gap-2 min-w-0 w-full">
                            <span className="truncate flex-1 min-w-0">
                              {child.name}
                            </span>

                            {/* Unread / mention dot — Teams style */}
                            {isUnread && (
                              <span
                                style={{
                                  backgroundColor: hasMention
                                    ? "oklch(0.577 0.245 27.325)"
                                    : "oklch(0.54 0.29 264)",
                                  height: "8px",
                                  width: "8px",
                                  borderRadius: "9999px",
                                  flexShrink: 0,
                                }}
                                aria-label={
                                  hasMention ? "Unread mention" : "Unread"
                                }
                              />
                            )}
                          </div>
                        </SidebarMenuSubButton>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className={cn(
                            "absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded flex items-center justify-center",
                            "opacity-0 group-hover/item:opacity-100 focus:opacity-100",
                            "hover:bg-sidebar-accent-foreground/10 transition-opacity",
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
                    onClick={() => setIsCreateRoomOpen(true)}
                  >
                    <CustomButton
                      variant="outline"
                      size="sm"
                      className="w-full text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                    >
                      <Plus /> Create Room
                    </CustomButton>
                  </SidebarMenuSubItem>
                </>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </>
  );
}

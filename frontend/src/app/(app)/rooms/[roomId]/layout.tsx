"use client";

import { useParams } from "next/navigation";
import {
  Phone,
  Video,
  Search,
  Info,
  MoreVertical,
  Pin,
  Bell,
  File,
  BellOff,
  Users,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { getInitials } from "@/modules/room/room.utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { CustomButton } from "@/shared/components";
import useRoomSocket from "@/modules/room/hooks/useRoomSocket";
import useRoomStore from "@/modules/room/room.store";
import useUserStatusStore from "@/shared/store/userStatusStore";
import { Badge } from "@/shared/components/ui/badge";
import { useState } from "react";
import MemberListPanel from "@/modules/room/components/MembersListPanel";
import { cn } from "@/shared/lib/utils";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const activeRoom = useRoomStore((state) => state.activeRoom);
  const id = params?.roomId as string;
  const [showMembers, setShowMembers] = useState(false);
  const getUserStatus = useUserStatusStore((state) => state.getUserStatus);
  useRoomSocket(id);

  const onlineCount = activeRoom?.members
    .map((member) => getUserStatus(member.id) === "ONLINE")
    .filter(Boolean).length;

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* ── Main Chat Area ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-background/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {getInitials(activeRoom?.name || "")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-base truncate">
                  {activeRoom?.name}
                </h1>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {onlineCount} online
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {`${activeRoom?.members?.length || 0} members · ${onlineCount || 0} online`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <TooltipProvider>
              {[
                { icon: Phone, label: "Voice Call" },
                { icon: Video, label: "Video Call" },
                { icon: Search, label: "Search" },
              ].map(({ icon: Icon, label }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <CustomButton
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </CustomButton>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {label}
                  </TooltipContent>
                </Tooltip>
              ))}

              <Tooltip>
                <TooltipTrigger asChild>
                  <CustomButton
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      showMembers
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setShowMembers((v) => !v)}
                  >
                    <Users className="h-4 w-4" />
                  </CustomButton>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Members
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <CustomButton
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Info className="h-4 w-4" />
                  </CustomButton>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Details
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CustomButton
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </CustomButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="gap-2 text-sm">
                    <Pin className="h-4 w-4" /> Pinned Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-sm">
                    <Bell className="h-4 w-4" /> Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-sm">
                    <File className="h-4 w-4" /> Shared Files
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-sm">
                    <Settings className="h-4 w-4" /> Room Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-sm text-destructive">
                    <BellOff className="h-4 w-4" /> Mute
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          </div>
        </div>
        {children}
      </div>

      {showMembers && (
        <MemberListPanel
          members={activeRoom?.members}
          onClose={() => setShowMembers(false)}
        />
      )}
    </div>
  );
}

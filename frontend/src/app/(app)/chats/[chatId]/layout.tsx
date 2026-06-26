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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import StatusDot from "@/modules/room/components/StatusDot";
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
import useChatSocket from "@/modules/room/hooks/useChatSocket";
import useRoomStore from "@/modules/room/room.store";
import useUserStatusStore from "@/shared/store/userStatusStore";
import { usePersonalInfo } from "@/modules/user/user.query";
import useCallStore from "@/modules/call/call.store";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const { data: personalInfo } = usePersonalInfo();
  const activeChat = useRoomStore((state) => state.activeChat);
  const activeRoomId = useRoomStore((state) => state.roomId);
  const id = params?.chatId as string;
  const getUserStatus = useUserStatusStore((state) => state.getUserStatus);
  const startCall = useCallStore((s) => s.startCall);
  const callStatus = useCallStore((s) => s.status);
  useChatSocket(id);

  const userStatus = getUserStatus(activeChat?.id || "");
  const isPersonalChat = personalInfo?.id === activeChat?.id;
  const peerUserId = activeChat?.id;
  const canCall =
    !isPersonalChat &&
    !!peerUserId &&
    !!activeRoomId &&
    callStatus === "idle" &&
    !!startCall;

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
                  {getInitials(activeChat?.name || "")}
                </AvatarFallback>
              </Avatar>
              <StatusDot status={userStatus} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-base truncate">
                  {activeChat?.name}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {userStatus === "ONLINE"
                  ? "Active now"
                  : userStatus === "AWAY"
                    ? "Away"
                    : "Offline"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <TooltipProvider>
              {!isPersonalChat && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CustomButton
                        variant="ghost"
                        size="icon"
                        disabled={!canCall}
                        onClick={() =>
                          startCall?.(activeRoomId!, peerUserId!, "AUDIO")
                        }
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Phone className="h-4 w-4" />
                      </CustomButton>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Voice Call
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CustomButton
                        variant="ghost"
                        size="icon"
                        disabled={!canCall}
                        onClick={() =>
                          startCall?.(activeRoomId!, peerUserId!, "VIDEO")
                        }
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Video className="h-4 w-4" />
                      </CustomButton>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Video Call
                    </TooltipContent>
                  </Tooltip>
                </>
              )}

              {/* Search stays in its own Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <CustomButton
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Search className="h-4 w-4" />
                  </CustomButton>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Search
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
    </div>
  );
}

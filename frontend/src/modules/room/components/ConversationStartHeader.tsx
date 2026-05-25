"use client";

import { Info } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { getInitials } from "../room.utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import StatusDot from "./StatusDot";
import { Chat } from "../room.types";
import { UserStatusType } from "@/modules/user/user.types";

interface ConversationStartHeaderProps {
  activeChat: Chat | null;
  userStatus: UserStatusType;
  isPersonalChat?: boolean;
}

const ConversationStartHeader = ({
  activeChat,
  userStatus,
  isPersonalChat,
}: ConversationStartHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-2 py-6 px-4 text-center">
      <div className="relative">
        <Avatar className="h-16 w-16">
          <AvatarImage src={activeChat?.avatar} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
            {getInitials(activeChat?.name || "")}
          </AvatarFallback>
        </Avatar>
        <StatusDot status={userStatus} className="h-4 w-4" />
      </div>

      <div>
        <div className="flex justify-center items-center gap-1">
          <p className="font-semibold text-base">{activeChat?.name}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">View Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isPersonalChat ? (
            "This is your own personal chat space, save drafts, files or test features before using them in a real chat."
          ) : (
            <div>
              <span>
                This is the beginning of your direct message history with
              </span>{" "}
              <span className="font-medium">{activeChat?.name}.</span>
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default ConversationStartHeader;

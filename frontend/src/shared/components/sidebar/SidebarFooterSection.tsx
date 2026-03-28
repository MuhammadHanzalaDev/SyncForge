"use client";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { useLogout } from "@/modules/auth/auth.mutation";
import { useRouter } from "next/navigation";
import { usePersonalInfo } from "@/modules/workspace/workspace.query";

export function SidebarFooterSection() {
  const router = useRouter();
  const { data: personalInfo, isLoading } = usePersonalInfo();
  const { mutate } = useLogout();

  const handleLogout = () => {
    mutate(undefined, { onSuccess: () => router.replace("/login") });
  };

  const initials = `${personalInfo?.firstName.slice(0, 1)}${personalInfo?.lastName.slice(0, 1)}`;
  const fullName = `${personalInfo?.firstName} ${personalInfo?.lastName}`;

  return (
    <SidebarFooter className="border-t border-sidebar-border px-2 py-3">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {/* Avatar */}
                  <Avatar className="h-9 w-9 rounded-full shrink-0">
                    <AvatarImage
                      src={personalInfo?.avatar}
                      alt={personalInfo?.firstName}
                    />
                    <AvatarFallback className="rounded-lg bg-primary from-violet-500 to-pink-500 text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & Email */}
                  <div className="flex flex-col gap-0.5 leading-none text-left overflow-hidden">
                    <span className="font-semibold text-sm truncate">
                      {fullName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {personalInfo?.email}
                    </span>
                  </div>

                  {/* Chevron */}
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width]"
                align="end"
                side="top"
              >
                <DropdownMenuItem className="gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </SidebarFooter>
  );
}

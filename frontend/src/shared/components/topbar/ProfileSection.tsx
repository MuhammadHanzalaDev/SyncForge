"use client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { usePersonalInfo } from "@/modules/user/user.query";
import { useLogout } from "@/modules/auth/auth.mutation";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";

const ProfileSection = () => {
  const router = useRouter();
  const { data: personalInfo, isLoading } = usePersonalInfo();
  const { mutate } = useLogout();

  const handleLogout = () => {
    mutate(undefined, { onSuccess: () => router.replace("/login") });
  };

  const initials = `${personalInfo?.firstName.slice(0, 1)}${personalInfo?.lastName.slice(0, 1)}`;
  const fullName = `${personalInfo?.firstName} ${personalInfo?.lastName}`;
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="data-[state=open]:bg-sidebar-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              {/* Avatar */}
              <Avatar className="h-9 w-9 rounded-full shrink-0">
                {personalInfo?.avatarId ? (
                  <AvatarImage
                    src={personalInfo?.avatar}
                    alt={personalInfo?.firstName}
                  />
                ) : (
                  <AvatarFallback className="rounded-lg bg-primary from-violet-500 to-pink-500 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Chevron */}
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold">{fullName || "N/A"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {personalInfo?.email || "N/A"}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 text-sm text-destructive cursor-pointer focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default ProfileSection;

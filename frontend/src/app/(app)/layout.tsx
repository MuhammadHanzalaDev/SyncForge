"use client";

import { useEffect } from "react";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/sidebar/AppSidebar";
import { useSocketStore } from "@/shared/store/socketStore";
import { useAuthStore } from "@/shared/store/authStore";
import useWorkspaceStore from "@/modules/workspace/workspace.store";
import TopBar from "@/shared/components/topbar/AppTopbar";
import useRegisterSocketEvents from "@/shared/hooks/useRegisterGlobalSocketEvents";
import { usePersonalInfo } from "@/modules/user/user.query";
import { CallProvider } from "@/modules/call/components/CallProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const workspaceId = useWorkspaceStore((state) => state.workspaceId);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const { data: personalInfo } = usePersonalInfo();

  useEffect(() => {
    if (!accessToken || !workspaceId) return;
    connect(accessToken, workspaceId || "");
    return () => disconnect();
  }, [accessToken, workspaceId]);

  useRegisterSocketEvents();

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>

      {/* Global call layer — listens for incoming calls on every page */}
      {personalInfo?.id && <CallProvider currentUserId={personalInfo.id} />}
    </SidebarProvider>
  );
}

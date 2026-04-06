"use client";
import { useEffect } from "react";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/sidebar/AppSidebar";
import { useSocketStore } from "@/shared/store/socketStore";
import { useAuthStore } from "@/shared/store/authStore";
import useWorkspaceStore from "@/modules/workspace/workspace.store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();
  const { workspaceId } = useWorkspaceStore();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (accessToken) {
      connect(accessToken, workspaceId || "");
    }

    return () => disconnect();
  }, [accessToken]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-screen">{children}</div>
    </SidebarProvider>
  );
}

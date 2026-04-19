"use client";

import { useEffect } from "react";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/sidebar/AppSidebar";
import { useSocketStore } from "@/shared/store/socketStore";
import { useAuthStore } from "@/shared/store/authStore";
import useWorkspaceStore from "@/modules/workspace/workspace.store";
import TopBar from "@/shared/components/topbar/AppTopbar";

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
      {/* ── Full-height shell ── */}
      <div className="flex flex-col h-screen w-full overflow-hidden">
        {/* Top bar spans full width above sidebar + content */}
        <TopBar />

        {/* ── Body: sidebar + main content ── */}
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

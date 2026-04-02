"use client";
import { useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/sidebar/AppSidebar";
import { useSocketStore } from "@/shared/store/socketStore";
import { useAuthStore } from "@/shared/store/authStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (accessToken) {
      connect(accessToken);
    }

    return () => disconnect();
  }, [accessToken]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-screen">
        <SidebarTrigger />
        {children}
      </div>
    </SidebarProvider>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/store/authStore";
import { useAuthInit } from "@/modules/auth/hooks/useAuthInit";
import { CustomLoader } from "@/shared/components";
import { ModeToggle } from "@/shared/components";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useAuthInit();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!localStorage.getItem("workspace")) {
      router.replace("/workspaces");
    }
  }, [isAuthenticated, isLoading, router]);

  return isLoading ? (
    <div className="h-screen flex justify-center items-center">
      <CustomLoader />
    </div>
  ) : (
    <div className="flex w-full justify-end pr-3">
      <ModeToggle />
    </div>
  );
}

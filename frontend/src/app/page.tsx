"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/store/authStore";
import { useAuthInit } from "@/modules/auth/hooks/useAuthInit";
import { CustomLoader } from "@/shared/ui";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useAuthInit();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    isLoading && (
      <div className="h-screen flex justify-center items-center">
        <CustomLoader />
      </div>
    )
  );
}

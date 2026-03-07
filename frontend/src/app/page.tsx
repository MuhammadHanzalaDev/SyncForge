"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/store/authStore";
import { useAuthInit } from "@/modules/auth/hooks/useAuthInit";

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

  return isLoading && <div>Loading...</div>;
}

"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/shared/store/authStore";
import axios from "axios";

export function useAuthInit() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        setAccessToken(res.data?.accessToken, true);
      } catch {
        setAccessToken(null, false);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [setAccessToken]);

  return { isLoading };
}

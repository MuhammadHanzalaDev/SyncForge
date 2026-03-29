"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/shared/store/authStore";
import { useAuthInit } from "@/modules/auth/hooks/useAuthInit";
import { CustomLoader } from "@/shared/components";
import { ModeToggle } from "@/shared/components";
import UpdateProfile from "@/modules/user/components/UpdateProfile";
import { usePersonalInfo } from "@/modules/user/user.query";

export default function RootPage() {
  const router = useRouter();
  const { data: personalInfo, isFetching: isFetchingPersonalInfo } =
    usePersonalInfo();
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useAuthInit();
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const shouldForceProfile =
    !isFetchingPersonalInfo &&
    !isLoading &&
    (!personalInfo?.firstName || !personalInfo?.lastName);
  const isDialogOpen = shouldForceProfile && !isManuallyClosed;

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
    <>
      <div className="flex w-full justify-end pr-3">
        <ModeToggle />
      </div>

      <UpdateProfile
        isOpen={isDialogOpen}
        setIsOpen={(open) => {
          if (!open) setIsManuallyClosed(true);
        }}
        data={{
          firstName: personalInfo?.firstName || "",
          lastName: personalInfo?.lastName || "",
        }}
      />
    </>
  );
}

"use client";

import VerifyOtp from "@/modules/auth/components/verify-otp";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtp />
    </Suspense>
  );
};

export default Page;

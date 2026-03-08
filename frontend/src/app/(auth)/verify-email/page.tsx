"use client";

import VerifyOtp from "@/modules/auth/components/verify-otp";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return <VerifyOtp email={email || ""} />;
};

export default Page;

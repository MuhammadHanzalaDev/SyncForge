"use client";
import { SignupForm } from "@/modules/auth/components/signup-form";
import { useState } from "react";

export default function Page() {
  const [isVerifyScreen, setIsVerifyScreen] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <SignupForm setIsVerifyScreen={setIsVerifyScreen} setEmail={setEmail} />
  );
}

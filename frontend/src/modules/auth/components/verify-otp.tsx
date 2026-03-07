"use client";

import { Button } from "@/shared/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/shared/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/ui/input-otp";
import { RefreshCwIcon } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { useVerifyEmail } from "../queries/auth.mutation";
import { CustomButton } from "@/shared/ui";
import { useAuthStore } from "@/shared/store/authStore";
import { useRouter } from "next/navigation";

interface VerifyOtpProps {
  email: string;
}

export default function VerifyOtp({ email }: VerifyOtpProps) {
  const router = useRouter();
  const { setAccessToken } = useAuthStore();
  const { mutate, isPending, isError, error } = useVerifyEmail();

  const [value, setValue] = useState("");

  const onSubmit = () => {
    if (value.length !== 6) return;

    mutate(
      {
        email,
        otp: value,
      },
      {
        onSuccess: (data) => {
          setAccessToken(data?.data?.accessToken, true);
          router.replace("/");
        },
      },
    );
  };

  return (
    <div className="mx-auto">
      <div className="mb-5">
        <div className="text-lg font-semibold">Verify your email</div>

        <div className="text-sm text-muted-foreground">
          Enter the verification code we sent to your email address:
          <span className="font-medium"> {email}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-5">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>

          <Button variant="outline" size="xs">
            <RefreshCwIcon />
            Resend Code
          </Button>
        </div>

        <InputOTP
          maxLength={6}
          id="digits-only"
          required
          pattern={REGEXP_ONLY_DIGITS}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
            <InputOTPSlot index={0} aria-invalid={isError} />
            <InputOTPSlot index={1} aria-invalid={isError} />
            <InputOTPSlot index={2} aria-invalid={isError} />
          </InputOTPGroup>

          <InputOTPSeparator className="mx-2" />

          <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
            <InputOTPSlot index={3} aria-invalid={isError} />
            <InputOTPSlot index={4} aria-invalid={isError} />
            <InputOTPSlot index={5} aria-invalid={isError} />
          </InputOTPGroup>
        </InputOTP>

        {isError && (
          <p className="text-sm text-red-500">
            {error?.message || "Verification failed"}
          </p>
        )}

        <FieldDescription className="mb-5">
          <a href="#">I no longer have access to this email address.</a>
        </FieldDescription>
      </div>

      <Field>
        <CustomButton
          type="button"
          className="w-full"
          isLoading={isPending}
          disabled={isPending || value.length !== 6}
          variant={"default"}
          onClick={onSubmit}
        >
          Verify
        </CustomButton>

        <div className="text-sm text-muted-foreground">
          Having trouble signing in?{" "}
          <a
            href="#"
            className="underline underline-offset-4 transition-colors hover:text-primary"
          >
            Contact support
          </a>
        </div>
      </Field>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { FieldDescription, FieldLabel } from "@/shared/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { RefreshCwIcon } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { useResendVerifyOtp, useVerifyEmail } from "../queries/auth.mutation";
import { useAuthStore } from "@/shared/store/authStore";
import { useRouter } from "next/navigation";
import { useCountdown } from "../hooks/useCountDown";
import { CustomButton } from "@/shared/components";

interface VerifyOtpProps {
  email: string;
}

export default function VerifyOtp({ email }: VerifyOtpProps) {
  const router = useRouter();
  const { setAccessToken, otpExpiresAt, setOtpExpiresAt } = useAuthStore();
  const { mutate, isError, error, isPending, reset } = useVerifyEmail();
  const { mutate: resendMutate, isPending: resendPending } =
    useResendVerifyOtp();
  const { formatted, isExpired } = useCountdown(otpExpiresAt);

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
          router.replace("/workspaces");
        },
      },
    );
  };

  const onResend = () => {
    resendMutate(email, {
      onSuccess: (data) => {
        setOtpExpiresAt(data?.data?.otpExpiresAt);
      },
    });
  };

  useEffect(() => {
    if (value.length === 6 && !isExpired && !isPending) {
      onSubmit();
    }
  }, [value]);

  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

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

          <CustomButton
            variant="outline"
            size="xs"
            disabled={!isExpired}
            onClick={onResend}
            isLoading={resendPending}
          >
            {isExpired ? (
              <>
                {!resendPending && <RefreshCwIcon />}
                Resend Code
              </>
            ) : (
              <>Resend in {formatted}</>
            )}
          </CustomButton>
        </div>

        <InputOTP
          maxLength={6}
          id="digits-only"
          required
          pattern={REGEXP_ONLY_DIGITS}
          value={value}
          onChange={(value) => {
            if (isError) reset();
            setValue(value);
          }}
          className="w-full"
          disabled={isExpired}
          autoFocus={true}
        >
          <InputOTPGroup className="flex flex-1 gap-2 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:flex-1 *:data-[slot=input-otp-slot]:text-xl">
            <InputOTPSlot index={0} aria-invalid={isError} />
            <InputOTPSlot index={1} aria-invalid={isError} />
            <InputOTPSlot index={2} aria-invalid={isError} />
          </InputOTPGroup>

          <InputOTPSeparator className="mx-2" />

          <InputOTPGroup className="flex flex-1 gap-2 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:flex-1 *:data-[slot=input-otp-slot]:text-xl">
            <InputOTPSlot index={3} aria-invalid={isError} />
            <InputOTPSlot index={4} aria-invalid={isError} />
            <InputOTPSlot index={5} aria-invalid={isError} />
          </InputOTPGroup>
        </InputOTP>

        {!isExpired && (
          <p className="text-xs text-muted-foreground">
            Code expires in {formatted}
          </p>
        )}

        {isExpired && (
          <p className="text-xs text-red-500">
            Code expired. Please resend a new one.
          </p>
        )}

        {isError && (
          <p className="text-sm text-red-500">
            {error?.message || "Verification failed"}
          </p>
        )}

        <FieldDescription className="mb-5">
          <a href="#">I no longer have access to this email address.</a>
        </FieldDescription>
      </div>
    </div>
  );
}

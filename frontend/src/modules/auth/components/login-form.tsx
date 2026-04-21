"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../auth.schema";
import { LoginFormValues } from "../auth.types";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/shared/components/ui/field";
import { CustomButton, CustomFormField } from "@/shared/components";
import Link from "next/link";
import { useLogin } from "../auth.mutation";
import { useAuthStore } from "@/shared/store/authStore";
import { useRouter } from "next/navigation";
import { ApiError } from "@/shared/types/api";
import message from "@/shared/utils/toast";

export function LoginForm() {
  const router = useRouter();
  const { setAccessToken, setOtpExpiresAt } = useAuthStore();
  const { mutate, isPending } = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: (data) => {
        setAccessToken(data?.accessToken, true);
        router.replace("/workspaces");
      },
      onError: (error: ApiError<any>) => {
        if (error.error === "EMAIL_NOT_VERIFIED") {
          router.replace(`/verify-email?email=${form.getValues().email}`);
          setOtpExpiresAt(error?.data?.otpExpiresAt || null);
        } else {
          message.error(error.message || "Something went wrong!");
        }
      },
    });
  };

  return (
    <FormProvider {...form}>
      <div className="mb-5">
        <div className=" text-lg font-semibold">Login to your account</div>
        <div className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <CustomFormField
            name="email"
            type="email"
            placeholder="Enter your email"
          />
          <CustomFormField
            name="password"
            type="password"
            placeholder="Password"
          />
          <a
            href="#"
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
          <FieldGroup>
            <Field>
              <CustomButton
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                variant="default"
                className="w-full"
              >
                Login
              </CustomButton>
              {/* <Button variant="outline" type="button">
                    Login with Google
                  </Button> */}
              <FieldDescription className="px-6 text-center">
                Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "../schemas/signup.schema";
import { Button } from "@/shared/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/shared/ui/field";
import { CustomFormField, CustomButton } from "@/shared/ui";
import Link from "next/link";
import { useSignup } from "../queries/auth.mutation";

interface SignupFormProps {
  isVerifyScreen: boolean;
  setIsVerifyScreen: (val: boolean) => void;
}

export function SignupForm({ setIsVerifyScreen }: SignupFormProps) {
  const { mutate, isPending } = useSignup(onSuccess);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSuccess() {
    setIsVerifyScreen(true);
  }

  const onSubmit = async (values: SignupFormValues) => {
    console.log(values);

    mutate(values);
  };

  return (
    <FormProvider {...form}>
      <div className="mb-5">
        <div className=" text-lg font-semibold">Create an account</div>
        <div className="text-sm text-muted-foreground">
          Enter your information below to create your account
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex gap-3">
            <CustomFormField
              name="firstName"
              type="text"
              placeholder="First Name"
            />
            <CustomFormField
              name="lastName"
              type="text"
              placeholder="Last Name"
            />
          </div>
          <CustomFormField
            name="email"
            type="email"
            placeholder="Enter your email"
          />
          <CustomFormField
            name="password"
            type="password"
            placeholder="Password"
            description="Must be at least 8 characters long."
          />
          <CustomFormField
            name="confirmPassword"
            type="password"
            // label="Confirm Password"
            placeholder="Confirm Password"
            description="Please confirm your password."
          />
          <FieldGroup>
            <Field>
              <CustomButton
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                variant="default"
                className="w-100"
              >
                Create Account
              </CustomButton>
              {/* <Button variant="outline" type="button">
                    Sign up with Google
                  </Button> */}
              <FieldDescription className="px-6 text-center">
                Already have an account? <Link href="/login">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

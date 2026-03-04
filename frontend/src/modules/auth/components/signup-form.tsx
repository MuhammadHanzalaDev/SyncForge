"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "../schemas/signup.schema";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/shared/ui/field";
import CustomFormField from "@/shared/ui/form/CustomFormField";
import Link from "next/link";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
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

  const onSubmit = async (values: SignupFormValues) => {
    console.log(values);

    // Later: send to backend
    // await fetch("/api/signup", {...})
  };

  return (
    <FormProvider {...form}>
      <div className="mb-5">
        <div className=" text-lg font-semibold">Create an account</div>
        <div className="text-sm text-muted-foreground">Enter your information below to create your account</div>
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
              <Button type="submit">Create Account</Button>
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

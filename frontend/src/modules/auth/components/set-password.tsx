"use client";
import { SetPasswordValues } from "../auth.types";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useSetPassword } from "../auth.mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPasswordSchema } from "../auth.schema";
import useGetSearchParams from "@/shared/Hooks/useGetSearchParams";
import message from "@/shared/utils/toast";
import { FieldGroup } from "@/shared/components/ui/field";
import { CustomFormField, CustomButton } from "@/shared/components";

const SetPassword = () => {
  const { token } = useGetSearchParams();
  const router = useRouter();
  const { mutate, isPending } = useSetPassword();

  const form = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSuccess() {
    message.success("Password set successfully!");
    router.replace(`/login`);
  }

  const onSubmit = async (values: SetPasswordValues) => {
    const data = {
      password: values.password,
      token: token?.toString() || "",
    };
    mutate(data, { onSuccess });
  };
  return (
    <FormProvider {...form}>
      <div className="mb-5">
        <div className=" text-lg font-semibold">Set Password</div>
        <div className="text-sm text-muted-foreground">
          Set a password for your account.
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
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
          <CustomButton
            type="submit"
            disabled={isPending}
            isLoading={isPending}
            variant="default"
            className="w-full"
          >
            Set Password
          </CustomButton>
        </FieldGroup>
      </form>
    </FormProvider>
  );
};

export default SetPassword;

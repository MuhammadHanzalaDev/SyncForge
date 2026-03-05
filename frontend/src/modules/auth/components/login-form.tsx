import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "../schemas/login.schema";
import { Button } from "@/shared/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/shared/ui/field";
import CustomFormField from "@/shared/ui/form/CustomFormField";
import Link from "next/link";

export function LoginForm({ ...props }: React.ComponentProps<"div">) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log(values);

    // Later: send to backend
    // await fetch("/api/signup", {...})
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
              <Button type="submit">Login</Button>
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

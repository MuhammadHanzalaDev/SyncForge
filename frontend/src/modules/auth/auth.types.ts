import z from "zod";
import { signupSchema } from "./schemas/signup.schema";
import { loginSchema } from "./schemas/login.schema";

type SignupFormValues = z.infer<typeof signupSchema>;

type LoginFormValues = z.infer<typeof loginSchema>;

interface VerifyOtpValues {
  email: string;
  otp: string;
}

export type { SignupFormValues, LoginFormValues, VerifyOtpValues };

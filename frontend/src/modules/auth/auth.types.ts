import z from "zod";
import { signupSchema, loginSchema, setPasswordSchema } from "./auth.schema";

type SignupFormValues = z.infer<typeof signupSchema>;

type LoginFormValues = z.infer<typeof loginSchema>;

interface VerifyOtpValues {
  email: string;
  otp: string;
}

type SetPasswordValues = z.infer<typeof setPasswordSchema>;

interface SetPasswordMutateValues {
  password: string;
  token: string;
}

export type {
  SignupFormValues,
  LoginFormValues,
  VerifyOtpValues,
  SetPasswordValues,
  SetPasswordMutateValues,
};

import { JwtPayload } from "jsonwebtoken";
import z from "zod";
import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
} from "./auth.validations";

interface AuthJwtPayload extends JwtPayload {
  userId: string;
}

type RegisterValues = z.infer<typeof validateRegister> & {
  refreshToken?: string;
  isVerified?: boolean;
};
type LoginValues = z.infer<typeof validateLogin>;
type VerifyEmailValues = z.infer<typeof validateVerifyEmail>;

interface OtpValues {
  id?: string;
  userId: string;
  code: string;
  expiresAt: Date;
  createdAt?: Date;
}

interface ResendOtpRequest {
  Body: { email: string };
}

interface SetPasswordRequest {
  Body: { password: string };
  Querystring: { token: string };
}

export {
  AuthJwtPayload,
  RegisterValues,
  LoginValues,
  VerifyEmailValues,
  OtpValues,
  ResendOtpRequest,
  SetPasswordRequest,
};

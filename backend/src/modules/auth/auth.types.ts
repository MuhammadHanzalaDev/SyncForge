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

type RegisterValues = z.infer<typeof validateRegister>;
type LoginValues = z.infer<typeof validateLogin>;
type VerifyEmailValues = z.infer<typeof validateVerifyEmail>;

export { AuthJwtPayload, RegisterValues, LoginValues, VerifyEmailValues };

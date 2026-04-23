import * as z from "zod";

const validateRegister = z.object({
  firstName: z.string("firstName is required!"),
  lastName: z.string("lastName is required!"),
  email: z.email("Email is required!"),
  password: z.string("password is required!"),
});

const validateVerifyEmail = z.object({
  email: z.email("Email is required!"),
  otp: z.string("otp is required!").length(6, "Otp must be 6 digits"),
});

const validateLogin = z.object({
  email: z.email("Email is required!"),
  password: z.string("password is required!"),
});

const setPassword = z.object({
  token: z.string(),
  password: z.string(),
});

const validateUpdatePersonalInfo = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  setPassword,
  validateUpdatePersonalInfo,
};

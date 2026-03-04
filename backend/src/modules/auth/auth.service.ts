import prisma from "@/config/prisma";
import { ApiError } from "@/utils/Error";
import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
} from "./auth.validations";
import {
  generateAccessToken,
  generateRefreshToken,
  hashString,
  compareHashedString,
  verifyRefreshToken,
  generateOTP,
  verifyOtp,
} from "./auth.utils";
import type {
  RegisterValues,
  LoginValues,
  VerifyEmailValues,
} from "./auth.types";
import { sendEmail } from "@/utils/mailService";

const registerService = async (data: RegisterValues) => {
  const parsed = validateRegister.parse(data);

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (existingUser) {
    throw new ApiError("Email is already in use.", 400);
  }

  const hashedPassword = await hashString(parsed.password);

  const user = await prisma.user.create({
    data: {
      ...parsed,
      password: hashedPassword,
    },
  });

  const { otp, expiresAt } = generateOTP();
  const hashedOtp = await hashString(otp);

  await prisma.otp.create({
    data: {
      userId: user.id,
      code: hashedOtp,
      expiresAt,
    },
  });

  await sendEmail(
    user.email,
    `${otp} is your SyncForge activation code`,
    `Copy and paste this code to activate your SyncForge account: ${otp}`,
  );
};

const verifyEmailService = async (data: VerifyEmailValues) => {
  const parsed = validateVerifyEmail.parse(data);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (!user) {
    throw new ApiError("User not found!", 400);
  }

  const otpRecord = await prisma.otp.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }, // get latest OTP
  });

  if (!otpRecord) throw new ApiError("OTP not found!", 410);

  await verifyOtp(parsed.otp, otpRecord.code, otpRecord.expiresAt);

  await prisma.otp.delete({ where: { id: otpRecord.id } });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { email: user.email },
    data: { refreshToken, isVerified: true },
  });

  return { refreshToken, accessToken };
};

const loginService = async (data: LoginValues) => {
  const parsed = validateLogin.parse(data);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (!user) {
    throw new ApiError("Invalid credentials", 400);
  }

  const isPasswordValid = await compareHashedString(
    parsed.password,
    user.password,
  );
  if (!isPasswordValid) {
    throw new ApiError("Invalid credentials", 400);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { email: user.email },
    data: { refreshToken },
  });

  return { refreshToken, accessToken };
};

const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) throw new ApiError("Unauthorized", 401);

  const decoded = verifyRefreshToken(refreshToken) as {
    userId: string;
  };
  const userId = decoded.userId;

  // Check if the refresh token has been revoked
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.refreshToken) {
    throw new ApiError("Refresh token not found!", 401);
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError("Invalid Refresh Token!", 401);
  }

  const accessToken = generateAccessToken(user.id);

  return accessToken;
};

export {
  registerService,
  verifyEmailService,
  loginService,
  refreshTokenService,
};

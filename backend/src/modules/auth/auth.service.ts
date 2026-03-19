import { ApiError } from "@/utils/Error";
import * as authRepo from "./auth.repository";
import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  setPassword,
} from "./auth.validations";
import {
  generateAccessToken,
  generateRefreshToken,
  hashString,
  compareHashedString,
  verifyRefreshToken,
  generateOTP,
  verifyOtp,
  verifyToken,
} from "./auth.utils";
import type {
  RegisterValues,
  LoginValues,
  VerifyEmailValues,
  AuthJwtPayload,
} from "./auth.types";
import { sendEmail } from "@/utils/mailService";

const registerService = async (data: RegisterValues) => {
  const parsed = validateRegister.parse(data);

  const existingUser = await authRepo.findUserByEmail(parsed.email);

  if (existingUser) {
    throw new ApiError("Email is already in use.", 400);
  }

  const hashedPassword = await hashString(parsed.password);

  const user = await authRepo.createUser({
    ...parsed,
    password: hashedPassword,
  });

  const { otp, expiresAt } = generateOTP();
  const hashedOtp = await hashString(otp);

  await authRepo.createOtp({
    userId: user.id,
    code: hashedOtp,
    expiresAt,
  });

  await sendEmail(
    user.email,
    `${otp} is your SyncForge activation code`,
    `Copy and paste this code to activate your SyncForge account: ${otp}`,
  );

  return expiresAt.getTime();
};

const verifyEmailService = async (data: VerifyEmailValues) => {
  const parsed = validateVerifyEmail.parse(data);

  const user = await authRepo.findUserByEmail(parsed.email);

  if (!user) {
    throw new ApiError("User not found!", 400);
  }

  const otpRecord = await authRepo.findLatestOtp(user.id);

  if (!otpRecord) throw new ApiError("OTP not found!", 410);

  await verifyOtp(parsed.otp, otpRecord.code, otpRecord.expiresAt);

  await authRepo.deleteOtp(otpRecord.id);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await authRepo.updateUserByEmail(user.email, {
    refreshToken,
    isVerified: true,
  });

  return { refreshToken, accessToken };
};

const loginService = async (data: LoginValues) => {
  const parsed = validateLogin.parse(data);

  const user = await authRepo.findUserByEmail(parsed.email);

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

  // email is not verified stop access and send verification email
  if (!user.isVerified) {
    const { otp, expiresAt } = generateOTP();
    const hashedOtp = await hashString(otp);

    await authRepo.createOtp({
      userId: user.id,
      code: hashedOtp,
      expiresAt,
    });

    await sendEmail(
      user.email,
      `${otp} is your SyncForge activation code`,
      `Copy and paste this code to activate your SyncForge account: ${otp}`,
    );

    throw new ApiError("Email Not Verified", 400, "EMAIL_NOT_VERIFIED", {
      otpExpiresAt: expiresAt.getTime(),
    });
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await authRepo.updateUserByEmail(user.email, { refreshToken });

  return { refreshToken, accessToken };
};

const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) throw new ApiError("Unauthorized", 401);

  const decoded = verifyRefreshToken(refreshToken) as {
    userId: string;
  };
  const userId = decoded.userId;

  // Check if the refresh token has been revoked
  const user = await authRepo.findUserById(userId);

  if (!user || !user.refreshToken) {
    throw new ApiError("Refresh token not found!", 401);
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError("Invalid Refresh Token!", 401);
  }

  const accessToken = generateAccessToken(user.id);

  return accessToken;
};

const resendVerifyOtpService = async (email: string) => {
  if (!email) {
    throw new ApiError("Email is Required!");
  }

  const user = await authRepo.findUserByEmail(email);

  if (!user) {
    throw new ApiError("Invalid Email!", 400);
  }

  const otpRecord = await authRepo.findLatestOtp(user.id);

  if ((otpRecord?.expiresAt || new Date()).getTime() > new Date().getTime()) {
    throw new ApiError("Otp not expired!", 400);
  }

  await authRepo.deleteOtp(otpRecord?.id || "");

  const { otp, expiresAt } = generateOTP();
  const hashedOtp = await hashString(otp);

  await authRepo.createOtp({
    userId: user.id,
    code: hashedOtp,
    expiresAt,
  });

  await sendEmail(
    user.email,
    `${otp} is your SyncForge activation code`,
    `Copy and paste this code to activate your SyncForge account: ${otp}`,
  );

  return expiresAt.getTime();
};

const setPasswordService = async (token: string, password: string) => {
  const parsed = setPassword.parse({ token, password });

  const userId = (verifyToken(parsed.token) as AuthJwtPayload).userId;

  const user = await authRepo.findUserById(userId);

  if (!user) throw new ApiError("User not found!", 404);

  if (user.refreshToken !== parsed.token)
    throw new ApiError("Invalid token!", 400);

  await authRepo.updateUserById(userId, {
    refreshToken: "",
    password: parsed.password,
  });
};

export {
  registerService,
  verifyEmailService,
  loginService,
  refreshTokenService,
  resendVerifyOtpService,
  setPasswordService,
};

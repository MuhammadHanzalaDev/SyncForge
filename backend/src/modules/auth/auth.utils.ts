import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import bcrypt from "bcryptjs";
import { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { ApiError } from "@/utils/Error";

const generateAccessToken = (id: string) => {
  return jwt.sign({ userId: id }, env.AUTH_SECRET, {
    expiresIn: env.AUTH_SECRET_EXPIRES_IN,
  });
};

const generateRefreshToken = (id: string) => {
  return jwt.sign({ userId: id }, env.AUTH_REFRESH_SECRET, {
    expiresIn: env.AUTH_REFRESH_SECRET_EXPIRES_IN,
  });
};

const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(token, env.AUTH_SECRET);
  return decoded;
};

const verifyRefreshToken = (token: string) => {
  const decoded = jwt.verify(token, env.AUTH_REFRESH_SECRET);
  return decoded;
};

const hashString = async (string: string) => {
  const hashed = await bcrypt.hash(string, 10);
  return hashed;
};

const compareHashedString = async (
  enteredString: string,
  hash: string | null,
) => {
  const isValid = await bcrypt.compare(enteredString, hash || "");
  return isValid;
};

const calculateCookieExpiry = (expiresIn: SignOptions["expiresIn"]) => {
  let expireMs;
  if (typeof expiresIn === "string") {
    const num = parseInt(expiresIn);
    if (expiresIn.includes("d")) expireMs = num * 24 * 60 * 60 * 1000;
    else if (expiresIn.includes("h")) expireMs = num * 60 * 60 * 1000;
    else if (expiresIn.includes("m")) expireMs = num * 60 * 1000;
    else expireMs = num * 1000; // seconds
  } else if (typeof expiresIn === "number") {
    expireMs = expiresIn * 1000; // if number is passed, treat as seconds
  }

  return expireMs;
};

const generateOTP = (minutes = 1) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  // Set expiry timestamp
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

  return { otp, expiresAt };
};

const verifyOtp = async (
  enteredOtp: string,
  storedOtpHash: string,
  otpExpiresAt: Date,
) => {
  if (!storedOtpHash || !otpExpiresAt) throw new ApiError("No OTP found!", 410);

  if (new Date(otpExpiresAt).getTime() < Date.now()) {
    throw new ApiError("OTP expired!", 403);
  }

  const isMatch = await compareHashedString(enteredOtp, storedOtpHash);
  if (!isMatch) {
    throw new ApiError("Invalid otp!", 400);
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashString,
  compareHashedString,
  calculateCookieExpiry,
  generateOTP,
  verifyOtp,
};

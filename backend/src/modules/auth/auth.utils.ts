import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import bcrypt from "bcryptjs";
import { SignOptions } from "jsonwebtoken";

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

const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};

const comparePassword = async (
  enteredPassword: string,
  savedPassword: string | null,
) => {
  const isValid = await bcrypt.compare(enteredPassword, savedPassword || "");
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

export {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  calculateCookieExpiry,
};

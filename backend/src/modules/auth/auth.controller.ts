import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { validateRegister, validateLogin } from "./auth.validations";
import { ApiError } from "@/utils/Error";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  calculateCookieExpiry,
} from "./auth.utils";
import { env } from "@/config/env";

type registerRequest = FastifyRequest<{
  Body: Prisma.UserCreateInput;
}>;

const register = async (request: registerRequest, reply: FastifyReply) => {
  const data = request.body;

  const parsed = validateRegister.parse(data);

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (existingUser) {
    throw new ApiError("Email is already in use.", 400);
  }

  const hashedPassword = await hashPassword(parsed.password);

  const user = await prisma.user.create({
    data: {
      ...parsed,
      password: hashedPassword,
    },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { email: user.email },
    data: { refreshToken },
  });

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });

  return { accessToken };
};

const login = async (request: registerRequest, reply: FastifyReply) => {
  const data = request.body;

  const parsed = validateLogin.parse(data);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (!user) {
    throw new ApiError("Invalid credentials", 400);
  }

  const isPasswordValid = await comparePassword(parsed.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError("Invalid credentials", 400);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { email: user.email },
    data: { refreshToken },
  });

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    maxAge: calculateCookieExpiry(env.AUTH_REFRESH_SECRET_EXPIRES_IN),
    sameSite: "strict",
  });

  return { accessToken };
};

const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.userId;

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }, // Clear the refresh token from the database
    });
  }

  reply.clearCookie("refreshToken");

  return { message: "Logged out successfully." };
};

const refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const refreshToken = request.cookies.refreshToken || "";

  if (!refreshToken) throw new ApiError("Unauthorized", 401);

  const decoded = jwt.verify(refreshToken, env.AUTH_REFRESH_SECRET) as {
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

  return { accessToken };
};

export { register, login, logout, refreshToken };

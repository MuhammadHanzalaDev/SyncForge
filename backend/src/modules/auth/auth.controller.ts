import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/config/prisma";
import { calculateCookieExpiry } from "./auth.utils";
import { env } from "@/config/env";
import type {
  RegisterValues,
  LoginValues,
  VerifyEmailValues,
} from "./auth.types";
import {
  loginService,
  refreshTokenService,
  verifyEmailService,
} from "./auth.service";
import { registerService } from "./auth.service";

const register = async (request: FastifyRequest<{ Body: RegisterValues }>) => {
  const data = request.body;

  await registerService(data);

  return { message: "An otp has been sent to your email address!" };
};

const verifyEmail = async (
  request: FastifyRequest<{ Body: VerifyEmailValues }>,
  reply: FastifyReply,
) => {
  const data = request.body;

  const { refreshToken, accessToken } = await verifyEmailService(data);

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });

  return { accessToken };
};

const login = async (
  request: FastifyRequest<{ Body: LoginValues }>,
  reply: FastifyReply,
) => {
  const data = request.body;

  const { refreshToken, accessToken } = await loginService(data);

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

const refreshToken = async (request: FastifyRequest) => {
  const refreshToken = request.cookies.refreshToken || "";

  const accessToken = await refreshTokenService(refreshToken);

  return { accessToken };
};

export { register, login, logout, refreshToken, verifyEmail };

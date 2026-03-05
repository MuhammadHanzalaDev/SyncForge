import jwt from "jsonwebtoken";

export const env = {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  DATABASE_URL: process.env.DATABASE_URL!,
  AUTH_SECRET: process.env.AUTH_SECRET!,
  AUTH_SECRET_EXPIRES_IN: process.env
    .AUTH_SECRET_EXPIRES_IN! as jwt.SignOptions["expiresIn"],
  AUTH_REFRESH_SECRET: process.env.AUTH_REFRESH_SECRET!,
  AUTH_REFRESH_SECRET_EXPIRES_IN: process.env
    .AUTH_REFRESH_SECRET_EXPIRES_IN! as jwt.SignOptions["expiresIn"],
  GMAIL_USER: process.env.GMAIL_USER!,
  GMAIL_USER_PASS: process.env.GMAIL_USER_PASS!,
  CLIENT_URL: process.env.CLIENT_URL!,
};

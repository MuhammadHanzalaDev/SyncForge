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
  JWT_SECRET: process.env.JWT_SECRET!,
  GMAIL_USER: process.env.GMAIL_USER!,
  GMAIL_USER_PASS: process.env.GMAIL_USER_PASS!,
  CLIENT_URL: process.env.CLIENT_URL!,
  SERVER_URL: process.env.SERVER_URL!,
  AWS_REGION: process.env.AWS_REGION!,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY!,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY!,
  AWS_BUCKET: process.env.AWS_BUCKET!,
};

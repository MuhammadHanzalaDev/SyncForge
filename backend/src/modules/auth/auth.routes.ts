import { FastifyPluginAsync } from "fastify";
import { register, login, logout, refreshToken } from "./auth.controller";

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/register", register);
  app.post("/login", login);
  app.post("/logout", { preHandler: [app.authenticate] }, logout);
  app.post("/refresh-token", refreshToken);
};

export default authRoutes;

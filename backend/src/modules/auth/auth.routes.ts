import { FastifyPluginAsync } from "fastify";
import { signUp } from "./auth.controller";

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/signup", signUp);
};

export default authRoutes;

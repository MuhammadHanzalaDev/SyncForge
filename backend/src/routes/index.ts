import { FastifyPluginAsync } from "fastify";
import authRoutes from "../modules/auth/auth.routes";

const routes: FastifyPluginAsync = async (app) => {
  app.register(authRoutes, { prefix: "/auth" });
};

export default routes;

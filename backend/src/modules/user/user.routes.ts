import { FastifyPluginAsync } from "fastify";
import { getPersonalInfo } from "./user.controller";

const userRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);

  app.get("/personal-info", getPersonalInfo);
};

export default userRoutes;
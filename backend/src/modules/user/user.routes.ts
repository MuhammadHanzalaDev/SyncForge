import { FastifyPluginAsync } from "fastify";
import { getPersonalInfo, updateProfileInfo } from "./user.controller";

const userRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);

  app.get("/personal-info", getPersonalInfo);
  app.patch(
    "/update-profile",
    { preHandler: [app.authenticate] },
    updateProfileInfo,
  );
};

export default userRoutes;

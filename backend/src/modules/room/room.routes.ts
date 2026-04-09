import { FastifyPluginAsync } from "fastify";
import { getRoomsRequest } from "./room.types";
import { getRooms } from "./room.controller";

const roomRoutes: FastifyPluginAsync = async (app) => {
  app.get<getRoomsRequest>(
    "/:workspaceId",
    { preHandler: app.authenticate },
    getRooms,
  );
};

export default roomRoutes;

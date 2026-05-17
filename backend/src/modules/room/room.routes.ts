import { FastifyPluginAsync } from "fastify";
import { getRoomsRequest } from "./room.types";
import { getRooms, createRoom } from "./room.controller";

const roomRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);

  app.get<getRoomsRequest>("/:workspaceId", getRooms);
  app.post("/", createRoom);
};

export default roomRoutes;

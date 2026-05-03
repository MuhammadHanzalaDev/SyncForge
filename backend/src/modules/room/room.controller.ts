import { FastifyRequest } from "fastify";
import type { getRoomsRequest } from "./room.types";
import { getRoomsService } from "./room.service";

const getRooms = async (request: FastifyRequest<getRoomsRequest>) => {
  const userId = request.user.userId;
  const workspaceId = request.params.workspaceId;

  const { chats, rooms } = await getRoomsService(userId, workspaceId);

  return { data: { rooms, chats } };
};

export { getRooms };

import { FastifyRequest } from "fastify";
import type { CreateRoomData, getRoomsRequest } from "./room.types";
import { createRoomService, getRoomsService } from "./room.service";
import { parseMultipart } from "@/utils/multipart";

const getRooms = async (request: FastifyRequest<getRoomsRequest>) => {
  const userId = request.user.userId;
  const workspaceId = request.params.workspaceId;

  const { chats, rooms } = await getRoomsService(userId, workspaceId);

  return { data: { rooms, chats } };
};

const createRoom = async (request: FastifyRequest) => {
  const userId = request.user?.userId;
  const { data, files } = await parseMultipart<CreateRoomData>(request);

  const room = await createRoomService(userId, data, files[0]);

  return { data: room };
};

export { getRooms, createRoom };

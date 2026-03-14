import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "@/utils/Error";
import { getFileUrl } from "@/services/storage.service";
import { findFileById } from "@/repositories/storage.repository";

const getFileUrlController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  const file = await findFileById(id);

  if (!file) throw new ApiError("File not found", 404);

  const url = await getFileUrl(file);

  return { url };
};

export { getFileUrlController };

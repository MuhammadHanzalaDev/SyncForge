import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "@/utils/Error";
import { getFileUrl, uploadFiles } from "@/modules/storage/storage.service";
import * as storageRepo from "./storage.repository";
import { parseMultipart } from "@/utils/multipart";
import { validateCreateFile } from "./storage.validation";

const getFileUrlController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  const file = await storageRepo.findFileById(id);

  if (!file) throw new ApiError("File not found", 404);

  const url = await getFileUrl(file.key);

  return { url };
};

const uploadAttachmentsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { files, data } = await parseMultipart(request);
  console.log("files", files);
  console.log("data", data);

  if (files?.length === 0) {
    throw new ApiError("Please upload files!");
  }

  const keys = await uploadFiles(files, "attachments");

  console.log("aws keys", keys);

  const filesArray = files.map((file, idx) => {
    const fileObj = {
      ...file,
      key: keys[idx],
      userId,
      status: "PENDING",
      kind: data?.kind || "FILE"
    };
    const formatted = validateCreateFile.parse(fileObj)

    return formatted;
  });

  console.log("files array js", filesArray);

  const fileDocs = await Promise.all(
    filesArray.map((f) => storageRepo.createFile(f)),
  );

  console.log("file docs", fileDocs);

  return { message: "Files pending send.", files: fileDocs };
};

export { getFileUrlController, uploadAttachmentsController };

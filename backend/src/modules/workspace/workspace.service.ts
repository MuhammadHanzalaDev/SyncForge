import { CreateWorkSpaceValues } from "./workspace.types";
import { validateCreateWorkspace } from "./workspace.validation";
import { createWorkspace } from "./workspace.repository";
import { uploadFile } from "../storage/storage.service";
import { createFile } from "../storage/storage.repository";
import { createFileSchema } from "../storage/storage.schema";
import { ApiError } from "@/utils/Error";

const createAndUploadFile = async (userId: string, file: any) => {
  if (!file) throw new ApiError("File not found!", 404);

  const key = await uploadFile(file, "PUBLIC");
  const fileObj = {
    ...file,
    key,
    userId,
  };
  const parsed = createFileSchema.parse(fileObj);

  const fileDoc = await createFile(parsed);

  return fileDoc;
};

const createWorkspaceService = async (
  userId: string,
  data: CreateWorkSpaceValues,
  file: any,
) => {
  const parsed = validateCreateWorkspace.parse(data);

  let avatarId = null;
  if (file) {
    const fileDoc = await createAndUploadFile(userId, file);
    avatarId = fileDoc.id;
  }

  return await createWorkspace({
    name: parsed.name,
    avatarId,
    members: {
      create: {
        userId,
        role: "OWNER",
      },
    },
  });
};

export { createWorkspaceService, createAndUploadFile };

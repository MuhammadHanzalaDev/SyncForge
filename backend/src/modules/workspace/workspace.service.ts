import { validateCreateWorkspace } from "./workspace.validation";
import { createWorkspace } from "./workspace.repository";
import { uploadFile } from "../storage/storage.service";
import { createFile } from "../storage/storage.repository";
import { createFileSchema } from "../storage/storage.schema";
import { ApiError } from "@/utils/Error";

const createAndUploadFile = async (
  userId: string,
  file: any,
  folder: "avatars" | "attachments" | "documents",
) => {
  if (!file) throw new ApiError("File not found!", 404);

  const key = await uploadFile(file, folder);
  const fileObj = {
    ...file,
    key,
    userId,
  };
  const parsed = createFileSchema.parse(fileObj);

  const fileDoc = await createFile(parsed);

  return fileDoc;
};

const createWorkspaceService = async (userId: string, data: any) => {
  const emails = Array.isArray(data.emails)
    ? data.emails
    : typeof data.emails === "string"
      ? [data.emails]
      : [];
  const parsed = validateCreateWorkspace.parse({ ...data, emails });

  let avatarId = null;
  if (data.file) {
    const fileDoc = await createAndUploadFile(userId, data.file, "avatars");
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

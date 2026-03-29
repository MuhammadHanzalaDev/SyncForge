import { updateUserById } from "../auth/auth.repository";
import { validateUpdatePersonalInfo } from "../auth/auth.validations";
import { createAndUploadFile } from "../storage/storage.service";

const updatePersonalInfoService = async (userId: string, data: any) => {
  const parsed = validateUpdatePersonalInfo.parse(data);

  let avatarId = null;
  if (data.file) {
    const fileDoc = await createAndUploadFile(userId, data.file, "avatars");
    avatarId = fileDoc.id;
  }

  // create workspace
  await updateUserById(userId, {
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    avatarId,
  });
};


export { updatePersonalInfoService };
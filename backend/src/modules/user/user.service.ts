import { SocketUser } from "@/types/socket";
import { updateUserById } from "../auth/auth.repository";
import { validateUpdatePersonalInfo } from "../auth/auth.validations";
import { createAndUploadFile } from "../storage/storage.service";
import { updateWorkspaceMember } from "../workspace/workspace.repository";

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

const userOnline = async (user: SocketUser) => {
  await updateWorkspaceMember(
    {
      userId_workspaceId: {
        userId: user?.userId,
        workspaceId: user?.workspaceId,
      },
    },
    {
      status: "ONLINE",
      lastSeenAt: null,
    },
  );
};

const userOffline = async (user: SocketUser) => {
  await updateWorkspaceMember(
    {
      userId_workspaceId: {
        userId: user?.userId,
        workspaceId: user?.workspaceId,
      },
    },
    {
      status: "OFFLINE",
      lastSeenAt: new Date(),
    },
  );
};

export { updatePersonalInfoService, userOffline, userOnline };

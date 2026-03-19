import { validateCreateWorkspace } from "./workspace.validation";
import {
  createWorkspace,
  findWorkspaceMember,
  createWorkspaceMember,
} from "./workspace.repository";
import { uploadFile } from "../storage/storage.service";
import { createFile } from "../storage/storage.repository";
import { createFileSchema } from "../storage/storage.validation";
import { ApiError } from "@/utils/Error";
import { generateToken, verifyToken } from "../auth/auth.utils";
import { env } from "@/config/env";
import { sendEmail } from "@/utils/mailService";
import {
  createUser,
  findUserByEmail,
  updateUserById,
} from "../auth/auth.repository";
import { joinWorkspacePayload } from "./workspace.validation";

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

  const workspace = await createWorkspace({
    name: parsed.name,
    avatarId,
    members: {
      create: {
        userId,
        role: "OWNER",
      },
    },
  });

  // send invitation emails to users
  if (emails.length > 0) {
    for (let email of emails) {
      const tokenPayload = {
        email,
        workspaceId: workspace.id,
      };

      const token = generateToken(tokenPayload, "7d");
      const invitationUrl = `${env.SERVER_URL}/api/v1/workspaces/join?token=${token}`;

      const user = await findUserByEmail(email);

      sendEmail(
        email,
        user
          ? `Invitation to join ${workspace.name}`
          : "You have been invited to syncforge",
        `You have been invited to join ${workspace.name} on SyncForge. If you are intrested to join this workspace click on this link to accept the invitation invitation. ${invitationUrl}`,
      )
        .then(() => console.log("email sent successfully"))
        .catch((err) => console.log("Failed to send invitaion email", err));
    }
  }

  return workspace;
};

const joinWorkspaceService = async (token: string, reply: any) => {
  const payload = verifyToken(token);
  const parsed = joinWorkspacePayload.parse(payload);

  const user = await findUserByEmail(parsed.email);

  if (user) {
    const workspaceMember = await findWorkspaceMember({
      userId_workspaceId: {
        userId: user.id,
        workspaceId: parsed.workspaceId,
      },
    });
    if (workspaceMember) {
      throw new ApiError("Workspace already joined!");
    }

    await createWorkspaceMember({
      userId: user.id,
      workspaceId: parsed.workspaceId,
      role: "MEMBER",
    });
  } else {
    const newUser = await createUser({
      email: parsed.email,
      firstName: "",
      lastName: "",
      password: "",
    });

    await createWorkspaceMember({
      userId: newUser.id,
      workspaceId: parsed.workspaceId,
      role: "MEMBER",
    });

    const tokenPayload = {
      userId: newUser.id,
    };

    const token = generateToken(tokenPayload, "7d");
    const setPasswordLink = `${env.SERVER_URL}/api/v1/auth/set-password?token=${token}`;

    await updateUserById(newUser.id, { refreshToken: token });

    sendEmail(
      parsed.email,
      "Set you password",
      `click on this link to set you syncforge account password. ${setPasswordLink}`,
    )
      .then(() => console.log("email sent successfully"))
      .catch((err) => console.log("Failed to send email", err));
  }
};

export { createWorkspaceService, createAndUploadFile, joinWorkspaceService };

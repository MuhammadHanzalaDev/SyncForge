import { validateCreateWorkspace } from "./workspace.validation";
import {
  createWorkspace,
  findWorkspaceMember,
  createWorkspaceMember,
} from "./workspace.repository";
import { ApiError } from "@/utils/Error";
import { generateToken, verifyToken } from "../auth/auth.utils";
import { env } from "@/config/env";
import { sendEmail } from "@/utils/mailService";
import {
  createUser,
  findUserByEmail,
  updateUserById,
} from "../auth/auth.repository";
import { validateJoinWorkspace } from "./workspace.validation";
import { createAndUploadFile } from "../storage/storage.service";

const createWorkspaceService = async (userId: string, data: any) => {
  const { data: dataObj, files } = data;

  const emails = Array.isArray(dataObj.emails)
    ? dataObj.emails
    : typeof dataObj.emails === "string"
      ? [dataObj.emails]
      : [];
  const parsed = validateCreateWorkspace.parse({ ...dataObj, emails });

  let avatarId = null;
  if (files[0]) {
    const fileDoc = await createAndUploadFile(userId, files[0], "avatars");
    avatarId = fileDoc.id;
  }

  // create workspace
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
  const parsed = validateJoinWorkspace.parse(payload);

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
    const setPasswordLink = `${env.CLIENT_URL}/set-password?token=${token}`;

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

export { createWorkspaceService, joinWorkspaceService };

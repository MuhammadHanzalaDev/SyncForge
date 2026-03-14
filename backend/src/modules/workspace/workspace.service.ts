import { CreateWorkSpaceValues } from "./workspace.types";
import { validateCreateWorkspace } from "./workspace.validation";
import { createWorkspace } from "./workspace.repository";

const createWorkspaceService = async (
  userId: string,
  data: CreateWorkSpaceValues,
  file: any,
) => {
  const parsed = validateCreateWorkspace.parse(data);

  const workspace = await createWorkspace({
    name: parsed.name,
    members: {
      create: {
        userId,
        role: "OWNER",
      },
    },
  });
};


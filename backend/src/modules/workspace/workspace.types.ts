import { validateCreateWorkspace } from "./workspace.validation";
import z from "zod";

type CreateWorkSpaceValues = z.infer<typeof validateCreateWorkspace>;

interface getChatsAndRoomsRequest {
  Params: {
    workspaceId: string;
  };
}

export type { CreateWorkSpaceValues, getChatsAndRoomsRequest };

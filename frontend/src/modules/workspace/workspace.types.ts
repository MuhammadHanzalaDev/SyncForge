import z from "zod";
import { createWorkSpaceSchema } from "./workspace.schema";

type CreateWorkSpaceValues = z.infer<typeof createWorkSpaceSchema>;

interface WorkspaceRes {
  id: string;
  name: string;
  createdAt: string;
  logo?: string | null;
  fileId?: string | null;
  totalMembers: number;
}

export type { CreateWorkSpaceValues, WorkspaceRes };

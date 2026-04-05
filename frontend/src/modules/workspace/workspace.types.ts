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

interface Chat {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: string;
  status: "ONLINE" | "OFFLINE" | "BUSY" | "AWAY";
}

interface Room {
  id: string;
  name: string;
  type: string;
  members: {
    id: string;
    firstName: true;
    lastName: true;
  };
  lastMessage: string;
}

export type { CreateWorkSpaceValues, WorkspaceRes, Chat, Room };

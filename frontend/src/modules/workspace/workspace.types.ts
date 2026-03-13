import z from "zod";
import { createWorkSpaceSchema } from "./workspace.schema";

type CreateWorkSpaceValues = z.infer<typeof createWorkSpaceSchema>;

export type { CreateWorkSpaceValues };

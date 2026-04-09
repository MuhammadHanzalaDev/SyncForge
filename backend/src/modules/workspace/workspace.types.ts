import { validateCreateWorkspace } from "./workspace.validation";
import z from "zod";

type CreateWorkSpaceValues = z.infer<typeof validateCreateWorkspace>;

export type { CreateWorkSpaceValues };

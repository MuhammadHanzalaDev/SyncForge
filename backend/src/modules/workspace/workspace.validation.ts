import * as z from "zod";
import { validateFile } from "../storage/storage.validation";

const validateCreateWorkspace = z.object({
  name: z.string().min(3, "name must be atleast 3 characters."),
  emails: z.array(z.email()),
  file: validateFile.optional(),
});

const validateJoinWorkspace = z.object({
  email: z.email(),
  workspaceId: z.string(),
});

export { validateCreateWorkspace, validateJoinWorkspace };

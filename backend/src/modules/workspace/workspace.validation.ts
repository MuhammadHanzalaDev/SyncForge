import * as z from "zod";

const validateCreateWorkspace = z.object({
  name: z.string().min(3, "name must be atleast 3 characters."),
  emails: z.array(z.email()),
});

const validateJoinWorkspace = z.object({
  email: z.email(),
  workspaceId: z.string(),
});

export { validateCreateWorkspace, validateJoinWorkspace };

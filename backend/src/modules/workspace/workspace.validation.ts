import * as z from "zod";
import { fileSchema } from "../storage/storage.schema";

const validateCreateWorkspace = z.object({
  name: z.string().min(3, "name must be atleast 3 characters."),
  emails: z.array(z.email()),
  file: fileSchema.optional(),
});

export { validateCreateWorkspace };

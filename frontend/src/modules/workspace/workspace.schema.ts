import { z } from "zod";

const createWorkSpaceSchema = z.object({
  name: z.string().min(3, "name must be atleast 3 characters."),
  emails: z.array(z.string().email()),
});

const emailSchema = z.string().email("Please enter a valid email");

export { createWorkSpaceSchema, emailSchema };

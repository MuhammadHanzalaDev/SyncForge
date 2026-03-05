import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export { loginSchema };

export type { LoginFormValues };

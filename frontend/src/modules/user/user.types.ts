import { z } from "zod";
import { setProfileSchema } from "./user.schema";

interface PersonalInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  avatarId?: string;
}

type UpdateProfileValues = z.infer<typeof setProfileSchema>;

export type { UpdateProfileValues, PersonalInfo };

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

type UserStatusType = "ONLINE" | "OFFLINE" | "AWAY" | "BUSY";
interface UserStatus {
  userId: string;
  status: UserStatusType;
}

export type { UpdateProfileValues, PersonalInfo, UserStatus, UserStatusType };

import { UserStatus } from "@/modules/user/user.types";

export type UserConnection = {
  sockets: Set<string>;
  status: UserStatus;
};

export const users = new Map<string, UserConnection>();

export function getUserStatusList() {
  return Array.from(users.entries()).map(([userId, data]) => ({
    userId,
    status: data.status,
  }));
}

import { UserStatus, UserStatusType } from "@/modules/user/user.types";
import { create } from "zustand";

interface UserStatusState {
  userStatuses: UserStatus[];

  setUserStatuses: (statuses: UserStatus[]) => void;

  setUserStatus: (status: UserStatus) => void;

  getUserStatus: (userId: string) => UserStatusType;
}

const useUserStatusStore = create<UserStatusState>((set, get) => ({
  userStatuses: [],

  // set full list
  setUserStatuses: (statuses) => set({ userStatuses: statuses }),

  // update or insert single user
  setUserStatus: (status) =>
    set((state) => {
      const exists = state.userStatuses.some((d) => d.userId === status.userId);

      if (exists) {
        return {
          userStatuses: state.userStatuses.map((d) =>
            d.userId === status.userId ? status : d,
          ),
        };
      }

      return {
        userStatuses: [...state.userStatuses, status],
      };
    }),

  // get full status
  getUserStatus: (userId) => {
    const user = get().userStatuses.find((d) => d.userId === userId);
    return user ? user.status : "OFFLINE";
  },
}));

export default useUserStatusStore;

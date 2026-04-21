import useSocketEvent from "@/shared/hooks/useSocketEvent";
import useUserStatusStore from "@/shared/store/userStatusStore";
import { UserStatus } from "../user.types";

export default function useUserSocket() {
  const { setUserStatus, setUserStatuses } = useUserStatusStore();

  // events
  useSocketEvent("user:status-list", (statuses: UserStatus[]) => {
    console.log("status list : ", statuses);
    setUserStatuses(statuses);
  });
  useSocketEvent("user:status", (status: UserStatus) => {
    console.log("user status updated : ", status);
    setUserStatus(status);
  });
}

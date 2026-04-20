import useSocketEvent from "@/shared/hooks/useSocketEvent";
import useOnlineUserStore from "@/shared/store/onlineUser.store";

export default function useUserSocket() {
  const { setOnlineUsers, addOnlineUser, removeOnlineUser } =
    useOnlineUserStore();

  // events
  useSocketEvent("user:online-list", (users: string[]) =>
    setOnlineUsers(users),
  );
  useSocketEvent("user:online", (userId: string) => addOnlineUser(userId));
  useSocketEvent("user:offline", ({ userId }) => removeOnlineUser(userId));
}

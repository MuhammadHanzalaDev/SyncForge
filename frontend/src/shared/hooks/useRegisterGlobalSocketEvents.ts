import useUserSocket from "@/modules/user/hooks/useUserSocket";
import useMessageSocket from "@/modules/message/hooks/useMessageSocket";

export default function useRegisterGlobalSocketEvents() {
  useUserSocket();
  useMessageSocket();
}

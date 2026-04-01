import { useSocketStore } from "../store/socketStore";

function useSocketEmit() {
  const { socket } = useSocketStore();
  return socket?.emit.bind(socket) ?? null;
}

export default useSocketEmit;

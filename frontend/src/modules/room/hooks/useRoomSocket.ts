// import useSocketEmit from "@/shared/hooks/useSocketEmit";
// import { useEffect } from "react";

// export default function useRoomSocket(memberId: string) {
//   const emit = useSocketEmit();

//   useEffect(() => {
//     if (!emit) return;

//     emit("room:join", { memberId });

//     return () => {
//       emit("room:leave", { memberId });
//     };
//   }, [emit]);
// }

import { useMutation } from "@tanstack/react-query";
import { createRoom } from "./room.api";
import { ApiError } from "@/shared/types/api";
import message from "@/shared/utils/toast";

const useCreateRoom = () => {
  return useMutation({
    mutationFn: createRoom,

    onError: (error: ApiError) => {
      message.error(error.message || "Something went wrong!");
    },
  });
};

export { useCreateRoom };

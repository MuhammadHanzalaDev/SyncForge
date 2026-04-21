import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "./user.api";
import { ApiError } from "@/shared/types/api";
import message from "@/shared/utils/toast";

const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,

    onError: (error: ApiError) => {
      message.error(error.message || "Something went wrong!");
    },
  });
};

export { useUpdateProfile };

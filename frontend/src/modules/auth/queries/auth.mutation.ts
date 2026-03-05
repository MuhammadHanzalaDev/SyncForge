import { useMutation } from "@tanstack/react-query";
import { signup } from "../services/auth.api";
import { ApiError } from "@/shared/types/api.types";
import message from "@/shared/utils/toast";

const useSignup = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: signup,

    onSuccess: () => {
      onSuccess();
    },

    onError: (error: ApiError) => {
      message.error(error.message || "Something went wrong!");
    },
  });
};

export { useSignup };

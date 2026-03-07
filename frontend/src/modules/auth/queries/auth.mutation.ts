import { useMutation } from "@tanstack/react-query";
import { login, logout, signup, verify } from "../services/auth.api";
import { ApiError } from "@/shared/types/api.types";
import message from "@/shared/utils/toast";

const useSignup = () => {
  return useMutation({
    mutationFn: signup,

    onError: (error: ApiError) => {
      message.error(error.message || "Something went wrong!");
    },
  });
};

const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verify,

    onError: (error: ApiError) => {
      message.error(error.message || "Something went wrong!");
    },
  });
};

const useLogin = () => {
  return useMutation({
    mutationFn: login,

    onError: (error: ApiError) => {
      message.error(error.message || "Something went wrong!");
    },
  });
};

const useLogout = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      onSuccess();
    },

    onError: (error: ApiError) => {
      message.error(error.message || "Something went wrong!");
    },
  });
};

export { useSignup, useVerifyEmail, useLogin, useLogout };

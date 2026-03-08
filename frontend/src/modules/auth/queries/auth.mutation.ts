import { useMutation } from "@tanstack/react-query";
import {
  login,
  logout,
  resendVerifyOtp,
  signup,
  verify,
} from "../services/auth.api";
import { ApiError } from "@/shared/types/api.types";
import message from "@/shared/utils/toast";
import { LoginFormValues } from "../types/auth.types";

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
  return useMutation<any, ApiError, LoginFormValues>({
    mutationFn: login,
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

const useResendVerifyOtp = () => {
  return useMutation({
    mutationFn: resendVerifyOtp,

    onError: (error: ApiError) => {
      message.error(error.message || "Something went wrong!");
    },
  });
};

export { useSignup, useVerifyEmail, useLogin, useLogout, useResendVerifyOtp };

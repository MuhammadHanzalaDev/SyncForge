import { api } from "@/shared/lib/axios";
import {
  LoginFormValues,
  SetPasswordMutateValues,
  SignupFormValues,
  VerifyOtpValues,
} from "./auth.types";
import { AxiosError } from "axios";
import message from "@/shared/utils/toast";

const signup = async (payload: SignupFormValues) => {
  try {
    const res = await api.post("/auth/register", payload);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err?.response?.data;
    }
  }
};

const verify = async (payload: VerifyOtpValues) => {
  try {
    const res = await api.post("/auth/verify", payload);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err?.response?.data;
    }
  }
};

const login = async (payload: LoginFormValues) => {
  try {
    const res = await api.post("/auth/login", payload);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err?.response?.data;
    }
  }
};

const logout = async () => {
  try {
    await api.post("/auth/logout");
    message.success("Logged out");
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err?.response?.data;
    }
  }
};

const refreshToken = async () => {
  try {
    const res = await api.post("/auth/refresh-token");
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err?.response?.data;
    }
  }
};

const resendVerifyOtp = async (email: string) => {
  try {
    const res = await api.post("/auth/resend-otp", { email });
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err?.response?.data;
    }
  }
};

const setPassword = async ({ password, token }: SetPasswordMutateValues) => {
  try {
    const res = await api.post(
      "/auth/set-password",
      { password },
      { params: { token } },
    );
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err?.response?.data;
    }
  }
};

export {
  signup,
  verify,
  login,
  logout,
  refreshToken,
  resendVerifyOtp,
  setPassword,
};

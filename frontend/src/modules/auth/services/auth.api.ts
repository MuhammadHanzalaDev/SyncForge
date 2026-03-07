import { api } from "@/shared/lib/axios";
import {
  LoginFormValues,
  SignupFormValues,
  VerifyOtpValues,
} from "../types/auth.types";
import { AxiosError } from "axios";

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
    const res = await api.post("/auth/logout");
    return res.data;
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

export { signup, verify, login, logout, refreshToken };

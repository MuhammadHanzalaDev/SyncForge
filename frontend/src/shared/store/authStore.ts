import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  otpExpiresAt: number | null;
  setOtpExpiresAt: (value: number | null) => void;
  setAccessToken: (token: string | null, isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  otpExpiresAt: null,
  setOtpExpiresAt: (value) => set({ otpExpiresAt: value }),
  setAccessToken: (token, isAuthenticated) =>
    set({ accessToken: token, isAuthenticated }),
}));

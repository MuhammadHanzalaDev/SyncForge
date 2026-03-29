import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";
import { PersonalInfo } from "./user.types";

const getPersonalInfo = async (): Promise<PersonalInfo> => {
  try {
    const res = await api.get("/users/personal-info");
    return res.data.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

const updateProfile = async (formData: FormData) => {
  try {
    const res = await api.patch("/auth/update-profile", formData);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err?.response?.data;
    }
  }
};

export { updateProfile, getPersonalInfo };

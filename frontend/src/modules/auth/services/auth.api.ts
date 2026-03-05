import { api } from "@/shared/lib/axios";
import { SignupFormValues } from "../schemas/signup.schema";
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

export { signup };

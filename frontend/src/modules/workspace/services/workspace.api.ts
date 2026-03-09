import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";

const getAllWorkspaces = async () => {
  try {
    const res = await api.get("/workspaces");
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

export { getAllWorkspaces }
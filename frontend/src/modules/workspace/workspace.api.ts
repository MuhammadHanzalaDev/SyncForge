import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";
import { PersonalInfo } from "./workspace.types";

const getAllWorkspaces = async () => {
  try {
    const res = await api.get("/workspaces");
    return res.data.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

const createWorkspace = async (formData: FormData) => {
  try {
    const res = await api.post("/workspaces", formData);
    return res.data.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

const getChatsAndRooms = async (workspaceId?: string | null) => {
  try {
    const res = await api.get(`/workspaces/${workspaceId}/chats`);
    return res.data?.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

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

export { getAllWorkspaces, createWorkspace, getChatsAndRooms, getPersonalInfo };

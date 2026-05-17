import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";

const getChatsAndRooms = async (workspaceId?: string | null) => {
  try {
    const res = await api.get(`/rooms/${workspaceId}`);
    return res.data?.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

const createRoom = async (data: FormData) => {
  try {
    const res = await api.post("/rooms", data);
    return res.data?.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

export { getChatsAndRooms, createRoom };

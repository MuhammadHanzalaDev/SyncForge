import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";
import { GetMessagesParams } from "./message.types";

const getMessages = async (
  roomId: string | null,
  params?: GetMessagesParams,
) => {
  try {
    const res = await api.get(`/messages/${roomId}`, { params });
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

export { getMessages };

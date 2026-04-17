import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";
import { GetMessagesParams, SendMessage } from "./message.types";

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

const sendMessage = async (data: SendMessage) => {
  try {
    const res = await api.post(`/messages/${data.roomId}`, data);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

export { getMessages, sendMessage };

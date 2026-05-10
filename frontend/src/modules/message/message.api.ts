import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";
import { GetMessagesParams, ReadMessage, SendMessage } from "./message.types";

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
    const payload: SendMessage = data;
    delete payload?.attachments; // attachments are already uploaded we just send ids in attachmentIds
    const res = await api.post(`/messages/${data.roomId}`, payload);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

const readMessage = async (data: ReadMessage) => {
  try {
    const res = await api.post(
      `/messages/${data.roomId}/${data.messageId}/read`,
    );
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

export { getMessages, sendMessage, readMessage };

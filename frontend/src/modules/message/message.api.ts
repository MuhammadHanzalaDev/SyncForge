import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";
import {
  GetMessagesParams,
  ReactMessage,
  ReadMessage,
  SendMessage,
} from "./message.types";

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

const reactMessage = async (data: ReactMessage) => {
  try {
    const messageId = data.messageId;
    const payload = { ...data };
    delete payload.messageId;
    const res = await api.post(`/messages/${messageId}/react`, payload);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

export { getMessages, sendMessage, readMessage, reactMessage };

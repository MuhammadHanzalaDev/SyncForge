import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";

const uploadAttachments = async (formData: FormData) => {
  try {
    const res = await api.post("/files/attachments", formData);
    return res.data.files;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw err.response?.data || err.message;
    }
    throw err;
  }
};

export { uploadAttachments };

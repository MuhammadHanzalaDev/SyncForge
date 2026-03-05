import { toast } from "sonner";

const message = {
  default: (msg: string) => toast.success(msg, { position: "top-center" }),
  success: (msg: string) => toast.success(msg, { position: "top-center" }),
  info: (msg: string) => toast.info(msg, { position: "top-center" }),
  warn: (msg: string) => toast.warning(msg, { position: "top-center" }),
  error: (msg: string) => toast.error(msg, { position: "top-center" }),
};

export default message;

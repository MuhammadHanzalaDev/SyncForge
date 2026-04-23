import { useMutation } from "@tanstack/react-query";
import { uploadAttachments } from "./file.api";

const useUploadAttachments = () => {
  return useMutation({
    mutationFn: uploadAttachments,
  });
};

export { useUploadAttachments };

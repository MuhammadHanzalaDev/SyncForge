import { useMutation } from "@tanstack/react-query";
import { createWorkspace } from "./workspace.api";
import { ApiError } from "@/shared/types/api.types";
import message from "@/shared/utils/toast";

const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: createWorkspace,

    onError: (error: ApiError) => {
      message.error(error.message || "Something went wrong!");
    },
  });
};

export { useCreateWorkspace };

import { useQuery } from "@tanstack/react-query";
import { fetchFileUrl } from "./file.api";
import { FileUrlResponse } from "./file.api";

function useFileUrl(fileId: string | undefined, enabled = true) {
  return useQuery<FileUrlResponse>({
    queryKey: ["fileUrl", fileId],
    queryFn: () => fetchFileUrl(fileId!),
    enabled: !!fileId && enabled,
    staleTime: (query) => {
      const d = query.state.data;
      return d ? (d.expiresIn - 300) * 1000 : 0;
    },
    gcTime: 2 * 60 * 60 * 1000, // 2h, independent of expiry
  });
}

export { useFileUrl };

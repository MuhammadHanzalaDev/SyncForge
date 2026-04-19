import { useQuery } from "@tanstack/react-query";
import { getPersonalInfo } from "./user.api";

const usePersonalInfo = () => {
  return useQuery({
    queryKey: ["personalInfo"],
    queryFn: getPersonalInfo,

    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export { usePersonalInfo };

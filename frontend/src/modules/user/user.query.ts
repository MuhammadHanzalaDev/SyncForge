import { useQuery } from "@tanstack/react-query";
import { getPersonalInfo } from "./user.api";

const usePersonalInfo = () => {
  return useQuery({
    queryKey: ["personalInfo"],
    queryFn: getPersonalInfo,
  });
};

export { usePersonalInfo };

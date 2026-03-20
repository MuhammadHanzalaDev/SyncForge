import { useSearchParams } from "next/navigation";

const useGetSearchParams = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  return {
    token,
  };
};

export default useGetSearchParams;

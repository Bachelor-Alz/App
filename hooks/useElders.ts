import { useQuery } from "@tanstack/react-query";
import { fetchAllElders } from "@/apis/elderAPI";

type Elder = {
  name: string;
  email: string;
};

export const useElders = () => {
  return useQuery<Elder[]>({
    queryKey: ["elders"],
    queryFn: fetchAllElders,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

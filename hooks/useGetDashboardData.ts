import { useQuery } from "@tanstack/react-query";
import { fetchDashBoardData } from "@/apis/healthAPI";

export const useDashBoardData = (elderId: string) => {
  return useQuery({
    queryKey: ["dashboard", elderId],
    queryFn: () => fetchDashBoardData(elderId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: !!elderId,
  });
};

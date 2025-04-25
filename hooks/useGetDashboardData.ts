import { useQuery } from "@tanstack/react-query";
import { fetchDashBoardData } from "@/apis/healthAPI";

export const useDashBoardData = (elderEmail: string) => {
  return useQuery({
    queryKey: ["dashboard", elderEmail],
    queryFn: () => fetchDashBoardData(elderEmail),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: !!elderEmail,
  });
};

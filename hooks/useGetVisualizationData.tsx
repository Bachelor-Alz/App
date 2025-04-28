import { useToast } from "@/providers/ToastProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type TimeRange = "Hour" | "Day" | "Week";

function useGetVisualizationData<T>({
  elderEmail,
  fetchFn,
  metricKey,
  prefetch = true,
  initialDate,
}: {
  elderEmail: string;
  fetchFn: (elderEmail: string, date: string, period: TimeRange) => Promise<T>;
  metricKey: string;
  prefetch?: boolean;
  select?: (data: T) => T;
  initialDate?: Date;
}) {
  const [date, setDate] = useState(initialDate ?? new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>("Day");
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const navigateTime = (direction: "prev" | "next") => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (timeRange === "Hour") newDate.setHours(newDate.getHours() + (direction === "next" ? 1 : -1));
      else if (timeRange === "Day") newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
      else if (timeRange === "Week") newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const query = useQuery({
    queryKey: [metricKey, elderEmail, timeRange, date.toISOString()],
    queryFn: () =>
      fetchFn(elderEmail, date.toISOString(), timeRange).catch((e) => {
        addToast("Error", e.message);
        throw e;
      }),

    enabled: !!elderEmail,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (!prefetch || !elderEmail) return;

    (async () => {
      const ranges: TimeRange[] = ["Hour", "Day", "Week"];
      await Promise.all(
        ranges
          .filter((range) => range !== timeRange)
          .map((range) =>
            queryClient.prefetchQuery({
              queryKey: [metricKey, elderEmail, range, date.toISOString()],
              queryFn: () => fetchFn(elderEmail, date.toISOString(), range),
            })
          )
      );
    })();
  }, [elderEmail, timeRange, date, prefetch, queryClient]);

  return {
    ...query,
    navigateTime,
    date,
    timeRange,
    setTimeRange,
  };
}

export default useGetVisualizationData;

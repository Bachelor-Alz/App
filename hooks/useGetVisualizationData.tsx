import { useToast } from "@/providers/ToastProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, addHours, format, getWeek, subDays } from "date-fns";
import { useEffect, useRef, useState } from "react";

export type TimeRange = "Hour" | "Day" | "Week";

const getRoundedDate = (date: Date, range: TimeRange): Date => {
  const roundedDate = new Date(date);

  switch (range) {
    case "Hour":
      roundedDate.setMinutes(Math.floor(roundedDate.getMinutes() / 5) * 5);
      break;
    case "Day":
      roundedDate.setHours(roundedDate.getHours(), 0, 0, 0);
      break;
    case "Week":
      const dayOfWeek = roundedDate.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      roundedDate.setDate(roundedDate.getDate() - daysToSubtract);
      roundedDate.setHours(roundedDate.getHours(), 0, 0, 0);
      break;
    default:
      throw new Error(`Unexpected timeRange value: ${range}`);
  }

  return roundedDate;
};

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
  const [date, setDate] = useState(getRoundedDate(initialDate ?? new Date(), "Day"));
  const [timeRange, setTimeRange] = useState<TimeRange>("Day");
  const hasPrefetched = useRef(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const timeFormat = (): string => {
    switch (timeRange) {
      case "Hour":
        return format(date, "HH:mm");
      case "Day":
        return format(date, "dd-MM");
      case "Week":
        return `Week ${getWeek(date)}`;
      default:
        throw new Error(`Unexpected timeRange value: ${timeRange}`);
    }
  };

  const navigateTime = (direction: "prev" | "next") => {
    const delta = direction === "next" ? 1 : -1;

    setDate((prevDate) => {
      if (timeRange === "Hour") return addHours(prevDate, delta);
      if (timeRange === "Day") return addDays(prevDate, delta);
      if (timeRange === "Week") return addDays(prevDate, delta * 7);

      throw new Error(`Unexpected timeRange value: ${timeRange}`);
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
    if (!prefetch || !elderEmail || hasPrefetched.current) return;

    hasPrefetched.current = true;

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
    timeFormat,
  };
}

export default useGetVisualizationData;

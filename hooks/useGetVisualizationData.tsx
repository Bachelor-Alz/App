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

type UseGetVisualizationDataProps<T> = {
  userId: string;
  fetchFn: (userId: string, date: string, period: TimeRange) => Promise<T>;
  metricKey: string;
  initialDate?: Date;
};

function useGetVisualizationData<T>({
  userId,
  fetchFn,
  metricKey,
  initialDate,
}: UseGetVisualizationDataProps<T>) {
  const [date, setDate] = useState(getRoundedDate(initialDate ?? new Date(), "Day"));
  const [timeRange, setTimeRange] = useState<TimeRange>("Day");
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
    queryKey: [metricKey, userId, timeRange, date.toISOString()],
    queryFn: () =>
      fetchFn(userId, date.toISOString(), timeRange).catch((e) => {
        addToast("Error", e.message);
        throw e;
      }),

    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

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

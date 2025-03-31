import { axiosInstance } from "@/apis/axiosConfig";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type TimeRange = "Hour" | "Day" | "Week";

type DataPoint = {
  timestamp: Date;
  min: number;
  avg: number;
  max: number;
};

async function fetchData(endpoint: string, timeRange: TimeRange, date: Date): Promise<DataPoint[]> {
  const isoDate = date.toISOString();
  const response = await axiosInstance.get(`${endpoint}?range=${timeRange.toLowerCase()}&date=${isoDate}`);
  return response.data;
}

function useGetVisualizationData(endpoint: string, prefetch: boolean = false) {
  const [date, setDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>("Day");
  const queryClient = useQueryClient();

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
    queryKey: [endpoint, timeRange, date.toISOString()],
    queryFn: () => fetchData(endpoint, timeRange, date),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  useEffect(() => {
    if (!prefetch) return;
    ["Hour", "Day", "Week"].forEach((range) => {
      if (range !== timeRange) {
        queryClient.prefetchQuery({
          queryKey: [endpoint, range, date.toISOString()],
          queryFn: () => fetchData(endpoint, range as TimeRange, date),
        });
      }
    });
  }, [endpoint, timeRange, date, queryClient]);

  return {
    ...query,
    navigateTime,
    date,
    timeRange,
    setTimeRange,
  };
}

export default useGetVisualizationData;

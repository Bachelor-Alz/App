import { useMemo } from "react";

export default function useLatestFallData<T extends { timestamp: string }>(
  data: T[],
  timeRange: "Hour" | "Day" | "Week"
): T[] {
  return useMemo(() => {
    if (timeRange !== "Week") return data;

    const groupedByDay: { [key: number]: T } = {};

    data.forEach((entry) => {
      const date = new Date(entry.timestamp);
      date.setHours(0, 0, 0, 0);
      const key = date.getTime();

      const existing = groupedByDay[key];
      if (!existing || new Date(entry.timestamp) > new Date(existing.timestamp)) {
        groupedByDay[key] = entry;
      }
    });

    return Object.values(groupedByDay).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [data, timeRange]);
}

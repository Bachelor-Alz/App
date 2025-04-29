import { TimeRange } from "@/hooks/useGetVisualizationData";
import { format, subDays } from "date-fns";

const formatDate = (timeRange: TimeRange, date: number): string => {
  switch (timeRange) {
    case "Hour":
      return format(date, "HH:mm");
    case "Day":
      return format(date, "HH");
    case "Week":
      const weekAgoDate = subDays(date, 7);
      return `${format(weekAgoDate, "dd")}`;
    default:
      throw new Error(`Unexpected timeRange value: ${timeRange}`);
  }
};

export default formatDate;

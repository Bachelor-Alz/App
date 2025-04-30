import { TimeRange } from "@/hooks/useGetVisualizationData";
import { format } from "date-fns";

const formatDate = (timeRange: TimeRange, date: number): string => {
  switch (timeRange) {
    case "Hour":
      return format(date, "HH:mm");
    case "Day":
      return format(date, "HH:00");
    case "Week":
      // Returns Mon, Tue, Wed, Thu, Fri, Sat, Sun
      return format(date, "E");
    default:
      throw new Error(`Unexpected timeRange value: ${timeRange}`);
  }
};

export default formatDate;

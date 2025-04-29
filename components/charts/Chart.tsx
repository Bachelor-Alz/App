import { CartesianChart, useChartPressState, useChartTransformState } from "victory-native";
import { Path, SkFont } from "@shopify/react-native-skia";
import { ToolTip } from "@/components/charts/Tooltip";
import { MD3Theme } from "react-native-paper";
import { format } from "date-fns";
import formatDate from "@/utils/formatDate";

const INIT_STATE = { x: 0, y: { min: 0, avg: 0, max: 0 } };

type ChartData = { day: number; min: number; avg: number; max: number }[];
type TimeRange = "Hour" | "Day" | "Week";

const ChartComponent = ({
  data,
  theme,
  font,
  boldFont,
  timeRange,
}: {
  data: ChartData;
  theme: MD3Theme;
  font: SkFont;
  boldFont: SkFont;
  timeRange: TimeRange;
}) => {
  const { state: firstPress, isActive: isFirstPressActive } = useChartPressState(INIT_STATE);
  const { state } = useChartTransformState();
  const color = theme.colors.onSurface;

  return (
    <CartesianChart
      data={data}
      frame={{ lineColor: color }}
      domainPadding={{ left: 30, right: 30, bottom: 15, top: 15 }}
      padding={{ left: 10, top: 5, bottom: 5, right: 20 }}
      xKey="day"
      yKeys={["min", "avg", "max"]}
      chartPressState={firstPress}
      transformState={state}
      xAxis={{
        lineColor: color,
        labelColor: color,
        font,
        labelRotate: -50,
        formatXLabel: (date) => formatDate(timeRange, date),
        tickCount: 10,
      }}
      yAxis={[
        {
          lineColor: color,
          labelColor: color,
          font,
          labelOffset: 10,
        },
      ]}>
      {({ points }) => (
        <>
          {data.map((_, index) => {
            const minPoint = points.min[index];
            const avgPoint = points.avg[index];
            const maxPoint = points.max[index];
            if (!minPoint || !avgPoint || !maxPoint) return null;
            const path = `M ${minPoint.x} ${minPoint.y} L ${maxPoint.x} ${maxPoint.y}`;
            return (
              <Path
                key={`line-${index}`}
                path={path}
                color={theme.colors.primary}
                style="stroke"
                strokeWidth={3}
              />
            );
          })}
          {isFirstPressActive && (
            <ToolTip
              x={firstPress.x}
              y={{
                data: [firstPress.y.max, firstPress.y.avg, firstPress.y.min],
                colors: [theme.colors.tertiary, theme.colors.primary, theme.colors.secondary],
                labels: ["Max", "Avg", "Min"],
              }}
              theme={theme}
              labels={{ x: "Date: " }}
              font={boldFont}
            />
          )}
        </>
      )}
    </CartesianChart>
  );
};

export default ChartComponent;

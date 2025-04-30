import { CartesianChart, useChartPressState, useChartTransformState } from "victory-native";
import { Path, SkFont } from "@shopify/react-native-skia";
import { ToolTip } from "@/components/charts/Tooltip";
import { MD3Theme } from "react-native-paper";
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
  const { state: pressState, isActive: isPressActive } = useChartPressState(INIT_STATE);
  const { state } = useChartTransformState();
  const color = theme.colors.onSurface;

  return (
    <CartesianChart
      data={data}
      frame={{ lineColor: color }}
      domainPadding={{ left: 30, right: 30, bottom: 1, top: 5 }}
      xKey="day"
      yKeys={["min", "avg", "max"]}
      chartPressState={pressState}
      transformState={state}
      xAxis={{
        lineColor: color,
        labelColor: color,
        font,
        labelRotate: -50,
        formatXLabel: (date) => formatDate(timeRange, date),
        tickCount: Math.min(7, data.length),
      }}
      yAxis={[
        {
          lineColor: color,
          labelColor: color,
          font,
        },
      ]}>
      {({ points, yScale }) => (
        <>
          {data.map((point, index) => {
            const minY = yScale(point.min);
            const maxY = yScale(point.max);
            const x = points.min[index].x;
            if (isNaN(minY) || isNaN(maxY)) return null;

            const path = `M ${x} ${maxY} L ${x} ${minY}`;

            return (
              <Path
                key={`bar-${index}`}
                path={path}
                color={theme.colors.primary}
                style="stroke"
                strokeWidth={5}
              />
            );
          })}

          {isPressActive && (
            <ToolTip
              x={pressState.x}
              y={{
                data: [pressState.y.max, pressState.y.avg, pressState.y.min],
                colors: [theme.colors.tertiary, theme.colors.primary, theme.colors.secondary],
                labels: ["Max", "Avg", "Min"],
              }}
              theme={theme}
              font={boldFont}
            />
          )}
        </>
      )}
    </CartesianChart>
  );
};

export default ChartComponent;

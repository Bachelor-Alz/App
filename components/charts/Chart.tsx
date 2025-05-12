import { CartesianChart, useChartPressState, useChartTransformState } from "victory-native";
import { Path, SkFont } from "@shopify/react-native-skia";
import { ToolTip } from "@/components/charts/Tooltip";
import { MD3Theme } from "react-native-paper";
import formatDate from "@/utils/formatDate";

type ChartData = Record<string, number> & { day: number };
type TimeRange = "Hour" | "Day" | "Week";

const createInitState = (yKeys: string[]) => ({
  x: 0,
  y: Object.fromEntries(yKeys.map((key) => [key, 0])) as Record<string, number>,
});

type ChartComponentProps = {
  data: ChartData[];
  theme: MD3Theme;
  font: SkFont;
  boldFont: SkFont;
  timeRange: TimeRange;
  yKeys: string[];
  labels?: string[];
  colors?: string[];
  barColor?: string;
};

const ChartComponent = ({
  data,
  theme,
  font,
  boldFont,
  timeRange,
  yKeys,
  labels,
  colors,
  barColor = theme.colors.primary,
}: ChartComponentProps) => {
  const { state: pressState, isActive: isPressActive } = useChartPressState(createInitState(yKeys));
  const { state } = useChartTransformState();
  const color = theme.colors.onSurface;
  const resolvedColors = colors || [theme.colors.secondary, theme.colors.primary, theme.colors.tertiary];

  return (
    <CartesianChart
      data={data}
      frame={{ lineColor: color }}
      domainPadding={{ left: 30, right: 30, bottom: 1, top: 5 }}
      xKey="day"
      yKeys={yKeys}
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
            const min = () => {
              const minValue = Math.min(...yKeys.map((key) => point[key]));
              return minValue === max ? 0 : minValue;
            };
            const max = Math.max(...yKeys.map((key) => point[key]));
            const minScale = yScale(min());
            const maxScale = yScale(max);

            const x = points[yKeys[0]][index].x;
            return (
              <Path
                key={`line-${index}`}
                path={`M ${x} ${minScale} L ${x} ${maxScale}`}
                color={barColor}
                style="stroke"
                strokeWidth={5}
              />
            );
          })}

          {isPressActive && (
            <ToolTip
              x={pressState.x}
              entries={yKeys.map((key, i) => {
                const entry = pressState.y[key];
                return {
                  label: labels?.[i] ?? key.charAt(0).toUpperCase() + key.slice(1),
                  value: entry?.value,
                  position: entry?.position,
                  color: resolvedColors?.[i],
                };
              })}
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

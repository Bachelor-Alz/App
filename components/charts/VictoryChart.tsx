import React from "react";
import { View } from "react-native";
import { CartesianChart, Line, useChartPressState, useChartTransformState } from "victory-native";
import { ToolTip } from "@/components/charts/Tooltip";
import { format } from "date-fns";

const INIT_STATE = { x: 0, y: { count: 0 } };
type TimeRange = "Hour" | "Day" | "Week";

type VictoryChartComponentProps = {
  data: Array<{ day: number; count: number }>;
  theme: any;
  font: any;
  boldFont: any;
  timeRange: TimeRange;
};

const VictoryChart: React.FC<VictoryChartComponentProps> = ({ data, theme, font, boldFont, timeRange }) => {
  const { state: firstPress, isActive: isFirstPressActive } = useChartPressState(INIT_STATE);
  const { state } = useChartTransformState();
  const color = theme.colors.onSurface;

  const formatLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    switch (timeRange) {
      case "Hour":
        return format(date, "h:mm");
      case "Day":
        return format(date, "ha");
      case "Week":
        return format(date, "MM-dd");
      default:
        return format(date, "PP");
    }
  };

  return (
    <View style={{ width: "100%", height: "90%", padding: 10 }}>
      <CartesianChart
        data={data}
        frame={{
          lineColor: color,
        }}
        domainPadding={{ left: 5, right: 5, bottom: 15, top: 15 }}
        padding={{ left: 10, top: 5, bottom: 5, right: 20 }}
        xKey="day"
        yKeys={["count"]}
        chartPressState={firstPress}
        transformState={state}
        xAxis={{
          lineColor: color,
          labelColor: color,
          font,
          labelRotate: -30,
          formatXLabel: formatLabel,
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
            <Line points={points.count} color={theme.colors.primary} strokeWidth={3} />
            {isFirstPressActive && (
              <ToolTip
                x={firstPress.x}
                theme={theme}
                font={boldFont}
                y={{
                  data: [firstPress.y.count],
                  labels: ["Steps"],
                  colors: [theme.colors.tertiary],
                }}
                labels={{ x: "Date: " }}
              />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
};

export default VictoryChart;

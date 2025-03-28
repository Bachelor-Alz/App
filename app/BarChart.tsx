import { View } from "react-native";
import { CartesianChart, useChartPressState, useChartTransformState } from "victory-native";
import { useFont, Path } from "@shopify/react-native-skia";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";
import { ToolTip } from "@/components/charts/Tooltip";
import { StatCard } from "@/components/charts/StatsCard";

const INIT_STATE = { x: 0, y: { min: 0, avg: 0, max: 0 } };

function LineChart() {
  const { state: firstPress, isActive: isFirstPressActive } = useChartPressState(INIT_STATE);
  const theme = useTheme();
  const font = useFont(require("../assets/fonts/Quicksand-Medium.ttf"), 15);
  const boldFont = useFont(require("../assets/fonts/Quicksand-Bold.ttf"), 15);
  const { state } = useChartTransformState();
  const color = theme.colors.onSurface;

  if (!font) return null;

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: theme.colors.surface,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text variant={"headlineLarge"} style={{ padding: 10 }}>
        Heart Rate
      </Text>
      <View style={{ width: "100%", height: "50%", padding: 10 }}>
        <CartesianChart
          data={DATA}
          frame={{
            lineColor: color,
          }}
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
            labelRotate: -30,
            formatXLabel: (label) => "Date: " + label,
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
              {DATA.map((_, index) => {
                const minPoint = points.min[index];
                const avgPoint = points.avg[index];
                const maxPoint = points.max[index];

                if (!minPoint || !avgPoint || !maxPoint) return null;

                const path = `M ${minPoint.x} ${minPoint.y} L ${avgPoint.x} ${avgPoint.y} L ${maxPoint.x} ${maxPoint.y}`;

                return (
                  <Path
                    key={`line-${index}`}
                    path={path}
                    color={theme.colors.primary}
                    style="stroke"
                    strokeWidth={5}
                  />
                );
              })}

              {isFirstPressActive && (
                <ToolTip
                  x={firstPress.x}
                  y={{
                    data: [firstPress.y.min, firstPress.y.avg, firstPress.y.max],
                    colors: [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary],
                    labels: ["Min", "Avg", "Max"],
                  }}
                  theme={theme}
                  labels={{ x: "Date: " }}
                  font={boldFont}
                />
              )}
            </>
          )}
        </CartesianChart>
      </View>
      <SegmentedButtons
        style={{ alignSelf: "center", padding: 10, marginBottom: 10, maxWidth: "90%" }}
        value={"option1"}
        onValueChange={(value) => console.log(value)}
        buttons={[
          { value: "option4", label: "Hour", style: { minWidth: 50 } },
          { value: "option1", label: "Day", style: { minWidth: 50 } },
          { value: "option2", label: "Week", style: { minWidth: 50 } },
          { value: "option3", label: "Month", style: { minWidth: 50 } },
        ]}
      />
      <StatCard
        title="Statistics"
        stats={[
          {
            label: "Min",
            value: Math.min(...DATA.map((data) => data.min)),
            icon: "arrow-down",
            color: theme.colors.primary,
          },
          {
            label: "Avg",
            value: DATA.reduce((sum, item) => sum + item.avg, 0) / DATA.length,
            icon: "trophy",
            color: theme.colors.secondary,
          },
          {
            label: "Max",
            value: Math.max(...DATA.map((data) => data.max)),
            icon: "arrow-up",
            color: theme.colors.tertiary,
          },
        ]}
        icon="chart-line"
        color="blue"
      />
    </View>
  );
}

const DATA = Array.from({ length: 31 }, (_, i) => {
  const base = 40 + 30 * Math.random();
  return {
    day: i + 1,
    min: base - 10 * Math.random(),
    avg: base,
    max: base + 10 * Math.random(),
  };
});

export default LineChart;

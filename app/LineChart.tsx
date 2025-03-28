import { View } from "react-native";
import { CartesianChart, Line, useChartPressState, useChartTransformState } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { Text, useTheme } from "react-native-paper";
import { ToolTip } from "@/components/charts/Tooltip";

const INIT_STATE = { x: 0, y: { highTmp: 0 } };

function VictoryChart() {
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
          domainPadding={{ left: 5, right: 5, bottom: 15, top: 15 }}
          padding={{ left: 10, top: 5, bottom: 5, right: 20 }}
          xKey="day"
          yKeys={["highTmp"]}
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
              <Line points={points.highTmp} color={theme.colors.primary} strokeWidth={3} />
              {isFirstPressActive && (
                <ToolTip
                  x={firstPress.x}
                  theme={theme}
                  font={boldFont}
                  y={{
                    data: [firstPress.y.highTmp],
                    labels: ["HR"],
                    colors: [theme.colors.tertiary],
                  }}
                  labels={{ x: "Date: " }}
                />
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  highTmp: 40 + 30 * Math.random(),
}));

export default VictoryChart;

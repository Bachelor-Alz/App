import { Fragment } from "react";
import { View } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { CartesianChart, Line, useChartPressState, useChartTransformState } from "victory-native";
import { Circle, Rect, SkFont, Text as SKText, useFont } from "@shopify/react-native-skia";
import { MD3Theme, SegmentedButtons, Text, useTheme } from "react-native-paper";

const INIT_STATE = { x: 0, y: { highTmp: 0 } };

function VictoryChart() {
  const { state: firstPress, isActive: isFirstPressActive } = useChartPressState(INIT_STATE);
  const theme = useTheme();
  const font = useFont(require("../assets/fonts/Quicksand-Medium.ttf"), 15);
  const boldFont = useFont(require("../assets/fonts/Quicksand-Regular.ttf"), 15);
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
                  y={firstPress.y.highTmp}
                  theme={theme}
                  font={boldFont}
                  labels={{ x: "Date: ", y: "HR: " }}
                />
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

type DataPoint = {
  value: SharedValue<number>;
  position: SharedValue<number>;
};

type ToolTipProps = {
  x: DataPoint;
  y: DataPoint;
  labels?: {
    x: string;
    y: string;
  };
  theme: MD3Theme;
  font: SkFont | null;
};
function ToolTip({ x, y, labels, theme, font }: ToolTipProps) {
  const yText = useDerivedValue(
    () => (labels?.y ? `${labels.y} ${Math.round(y.value.value)}` : `${Math.round(y.value.value)}`),
    [y, labels]
  );
  const xText = useDerivedValue(
    () => (labels?.x ? `${labels.x} ${x.value.value}` : `${x.value.value}`),
    [x, labels]
  );

  const maxLength = Math.max(yText.value.length, xText.value.length);
  const textPadding = 10;
  const boxWidth = maxLength * 8 + textPadding * 2;
  const boxHeight = 50;
  const circleRadius = 5;
  const margin = 10;

  const tooltipY = useDerivedValue(() => {
    const safeY = y.position.value;
    if (safeY < boxHeight + margin) {
      return safeY + circleRadius + margin;
    }
    return safeY - boxHeight - margin;
  }, [y]);

  const tooltipX = useDerivedValue(() => x.position.value - boxWidth / 2, [x]);

  return (
    <Fragment>
      <Circle cx={x.position} cy={y.position} r={circleRadius} color={theme.colors.onSurface} />
      <Rect
        x={tooltipX}
        y={tooltipY}
        width={boxWidth}
        height={boxHeight}
        color={theme.colors.surfaceVariant}
      />
      <SKText
        text={yText}
        x={useDerivedValue(() => tooltipX.value + textPadding, [tooltipX])}
        y={useDerivedValue(() => tooltipY.value + 20, [tooltipY])}
        color={theme.colors.onSurface}
        font={font}
      />
      <SKText
        text={xText}
        x={useDerivedValue(() => tooltipX.value + textPadding, [tooltipX])}
        y={useDerivedValue(() => tooltipY.value + 40, [tooltipY])}
        color={theme.colors.onSurface}
        font={font}
      />
    </Fragment>
  );
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  highTmp: 40 + 30 * Math.random(),
}));

export default VictoryChart;

import * as React from "react";
import { View } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, SkFont, Text, useFont } from "@shopify/react-native-skia";
import { MD3Theme, useTheme } from "react-native-paper";
import { useFonts as uFonts } from "expo-font";


const INIT_STATE = { x: 0, y: { highTmp: 0 } };


function VictoryChart() {
  const { state: firstPress, isActive: isFirstPressActive } =
    useChartPressState(INIT_STATE);
    const theme = useTheme();
    const font = useFont(require("../assets/fonts/SpaceMono-Regular.ttf"))



  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        data={DATA}
        xKey="day"
        yKeys={["highTmp"]}
        chartPressState={firstPress}
        padding={50}
      >
        {({ points }) => (
          <>
            <Line points={points.highTmp} color="red" strokeWidth={3} />
            {isFirstPressActive && firstPress ? (
                 <ToolTip
                 x={firstPress.x}
                 y={firstPress.y.highTmp}
                 theme={theme}
                 font={font}
               />
            ) : null}
          </>
        )}
      </CartesianChart>
    </View>
  );
}

type DataPoint = {
    value : SharedValue<number>
    position : SharedValue<number>
}

function ToolTip({ x, y, theme, font }: { x : DataPoint, y : DataPoint, theme: MD3Theme, font: SkFont | null }) {
    const text = useDerivedValue(() => {
        return y.value.value.toString()
    }, [x])

    return (
    <React.Fragment>
           <Circle cx={x.position} cy={y.position} r={8} color={theme.colors.onSurface} />
           <Text text={text} x={x.position} y={y.position.value - 50} color={theme.colors.onSurface}  font={font}/>
    </React.Fragment>);
  }


const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  highTmp: 40 + 30 * Math.random(),
}));

export default VictoryChart;
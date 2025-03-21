import React, { useState } from "react";
import { Dimensions, View, Animated, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { usePanResponder } from "@/hooks/usePanResponder";

const screenWidth = Dimensions.get("window").width;
const dataPointsCount = 13;
const pointWidth = 74;
const chartWidth = dataPointsCount * pointWidth;

const startTime = new Date();
startTime.setHours(12, 0, 0, 0);

const labels = Array.from({ length: dataPointsCount }, (_, i) => {
  let time = new Date(startTime.getTime() + i * 5 * 60 * 1000);
  return time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
});

const actualData = Array.from({ length: dataPointsCount }, () =>
  Math.floor(Math.random() * (120 - 60 + 1)) + 60
);

const dummyData = new Array(dataPointsCount).fill(220);

const data = {
  labels,
  datasets: [
    {
      data: actualData,
    },
    {
      data: dummyData,
      withDots: false,
      strokeWidth: 0,
      color: () => "rgba(0,0,0,0)",
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "transparent",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "transparent",
  backgroundGradientToOpacity: 0,
  withHorizontalLabels: false,
  withOuterLines: false,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const BezierChart = () => {
  const { translateX, panResponder } = usePanResponder(chartWidth);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, value: 0, visible: false });


  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        <LineChart
          data={data}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          withInnerLines={false}
          bezier
          fromZero={true}
          formatYLabel={(y) => parseInt(y, 10).toString()}
          onDataPointClick={(dataPoint) => {
            if (
              tooltipPos.visible &&
              tooltipPos.x === dataPoint.x &&
              tooltipPos.y === dataPoint.y
            ) {
              setTooltipPos({ ...tooltipPos, visible: false });
            } else {
              setTooltipPos({
                x: dataPoint.x,
                y: dataPoint.y,
                value: dataPoint.value,
                visible: true,
              });
            }
          }}
        />
        {tooltipPos.visible && (
          <View
            style={{
              position: "absolute",
              top: tooltipPos.y,
              left: tooltipPos.x,
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>{tooltipPos.value}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: "#000",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
  },
});

export default BezierChart;

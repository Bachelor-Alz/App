import { View, StyleSheet } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import { StatCard } from "@/components/charts/StatsCard";
import { useLocalSearchParams } from "expo-router";
import useGetVisualizationData from "@/hooks/useGetVisualizationData";
import { fetchSteps } from "@/apis/healthAPI";
import ChartComponent from "@/components/charts/Chart";
import ChartTitle, { ChartType } from "@/components/charts/ChartTitle";
import { useState } from "react";

type TimeRange = "Hour" | "Day" | "Week";

function StepsScreen() {
  const theme = useTheme();
  const font = useFont(require("../assets/fonts/Quicksand-Medium.ttf"), 15);
  const boldFont = useFont(require("../assets/fonts/Quicksand-Bold.ttf"), 15);
  const { email } = useLocalSearchParams<{ email?: string }>();
  const elderEmail = email || "";

  const {
    isError,
    isLoading,
    data: rawData,
    setTimeRange,
    timeRange,
    timeFormat,
    navigateTime,
  } = useGetVisualizationData({
    elderEmail,
    fetchFn: fetchSteps,
    metricKey: "steps",
  });

  const [chartType, setChartType] = useState<ChartType>("bar");

  if (!font || !boldFont) return null;

  if (isLoading) {
    return (
      <SmartAreaView>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.centeredText}>Loading...</Text>
        </View>
      </SmartAreaView>
    );
  }

  if (isError || !rawData) {
    return (
      <SmartAreaView>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.centeredText}>No Steps data available</Text>
        </View>
      </SmartAreaView>
    );
  }

  const isEmpty = rawData.length === 0;

  const chartData = isEmpty
    ? [{ day: 0, stepcount: 0 }]
    : rawData.map((item) => ({
        day: new Date(item.timestamp).getTime(),
        stepcount: Number(item.stepsCount),
      }));

  const stepsValues = isEmpty ? [0] : rawData.map((d) => Number(d.stepsCount || 0));
  const avg = stepsValues.reduce((sum, val) => sum + val, 0) / stepsValues.length;
  const max = Math.max(...stepsValues);

  const stats = [
    {
      label: "Avg",
      value: Math.round(avg),
      icon: "trophy" as const,
      color: theme.colors.primary,
    },
    {
      label: "Max",
      value: Math.round(max),
      icon: "arrow-up" as const,
      color: theme.colors.tertiary,
    },
  ];

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <ChartTitle
          title="Steps"
          timePeriod={timeFormat}
          navigateTime={navigateTime}
          theme={theme}
          buttonColor={"#2ed573"}
          chartType={chartType}
          onChartTypeChange={setChartType}
        />

        <View style={styles.chartContainer}>
          <ChartComponent
            data={chartData}
            theme={theme}
            font={font}
            boldFont={boldFont}
            timeRange={timeRange}
            yKeys={["stepcount"]}
            barColor={"#2ed573"}
            colors={[theme.colors.primary]}
            chartType={chartType}
          />
        </View>

        <SegmentedButtons
          style={styles.segmentedButtons}
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
          buttons={[
            { value: "Hour", label: "Hour" },
            { value: "Day", label: "Day" },
            { value: "Week", label: "Week" },
          ]}
        />

        <StatCard title="Statistics" stats={stats} icon="chart-line" color="#2ed573" />
      </View>
    </SmartAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chartContainer: {
    flex: 1,
    marginBottom: 20,
  },
  segmentedButtons: {
    alignSelf: "center",
    marginBottom: 20,
    maxWidth: "90%",
  },
  centeredText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default StepsScreen;

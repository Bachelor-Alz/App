import { View, StyleSheet } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import ChartComponent from "@/components/charts/Chart";
import { StatCard } from "@/components/charts/StatsCard";
import { useLocalSearchParams } from "expo-router";
import useGetVisualizationData from "@/hooks/useGetVisualizationData";
import { fetchDistance } from "@/apis/healthAPI";
import ChartTitle, { ChartType } from "@/components/charts/ChartTitle";
import { useState } from "react";

type TimeRange = "Hour" | "Day" | "Week";

function DistanceScreen() {
  const theme = useTheme();
  const font = useFont(require("../assets/fonts/Quicksand-Medium.ttf"), 15);
  const boldFont = useFont(require("../assets/fonts/Quicksand-Bold.ttf"), 15);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const elderId = id || "";

  const { isError, isLoading, data, setTimeRange, timeRange, navigateTime, timeFormat } =
    useGetVisualizationData({
      userId: elderId,
      fetchFn: fetchDistance,
      metricKey: "distance",
    });

  const [chartType, setChartType] = useState<ChartType>("bar");

  if (!font || !boldFont) return null;

  if (isLoading) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>Loading...</Text>
        </View>
      </SmartAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>No Distance data available</Text>
        </View>
      </SmartAreaView>
    );
  }

  const isEmpty = data?.length === 0;

  const chartData = isEmpty
    ? [{ day: 0, distance: 0 }]
    : data.map((item) => ({
        day: new Date(item.timestamp).getTime(),
        distance: item.distance * 1000,
      }));

  const distanceValues = isEmpty ? [0] : data.map((d) => (d.distance || 0) * 1000); // Convert km to m
  const avg = distanceValues.reduce((sum, val) => sum + val, 0) / distanceValues.length;
  const max = Math.max(...distanceValues);

  const stats = [
    {
      label: "Avg",
      value: avg,
      icon: "trophy" as const,
      color: theme.colors.primary,
    },
    {
      label: "Max",
      value: max,
      icon: "arrow-up" as const,
      color: theme.colors.tertiary,
    },
  ];

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <ChartTitle
          title="Distance"
          timePeriod={timeFormat}
          navigateTime={navigateTime}
          theme={theme}
          buttonColor="#ff7f50"
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
            yKeys={["distance"]}
            barColor="#ff7f50"
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

        <StatCard title="Statistics" stats={stats} icon="chart-line" color="#ff7f50" />
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

export default DistanceScreen;

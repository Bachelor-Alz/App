import { View, StyleSheet } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import { StatCard } from "@/components/charts/StatsCard";
import ChartComponent from "@/components/charts/Chart";
import useGetVisualizationData from "@/hooks/useGetVisualizationData";
import { fetchHeartRate } from "@/apis/healthAPI";
import ChartTitle, { ChartType } from "@/components/charts/ChartTitle";
import { useState } from "react";
import { SharedHealthStackParamList } from "../navigation/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type TimeRange = "Hour" | "Day" | "Week";
type Props = NativeStackScreenProps<SharedHealthStackParamList, "HeartRate">;
function HeartRateScreen({ route }: Props) {
  const theme = useTheme();
  const font = useFont(require("../../assets/fonts/Quicksand-Medium.ttf"), 15);
  const boldFont = useFont(require("../../assets/fonts/Quicksand-Bold.ttf"), 15);
  const id = route.params.id;

  const { isError, isLoading, data, setTimeRange, timeRange, timeFormat, navigateTime } =
    useGetVisualizationData({
      userId: id,
      fetchFn: fetchHeartRate,
      metricKey: "heartRate",
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

  if (isError) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>Error loading data</Text>
        </View>
      </SmartAreaView>
    );
  }

  if (!data) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>No heart rate data available</Text>
        </View>
      </SmartAreaView>
    );
  }

  const isEmpty = data.length === 0;
  const chartData = isEmpty
    ? [{ day: 0, min: 0, avg: 0, max: 0 }]
    : data.map((item) => ({
        day: new Date(item.timestamp).getTime(),
        min: item.minrate,
        avg: item.avgrate,
        max: item.maxrate,
      }));

  const min = isEmpty ? 0 : Math.min(...data.map((d) => d.minrate));
  const avg = isEmpty ? 0 : data.reduce((sum, item) => sum + item.avgrate, 0) / data.length;
  const max = isEmpty ? 0 : Math.max(...data.map((d) => d.maxrate));

  const stats = [
    {
      label: "Min",
      value: Math.round(min),
      icon: "arrow-down" as const,

      color: theme.colors.secondary,
    },
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
          title="Heart Rate"
          timePeriod={timeFormat}
          navigateTime={navigateTime}
          theme={theme}
          chartType={chartType}
          buttonColor={theme.colors.error}
          onChartTypeChange={setChartType}
        />
        <View style={styles.chartContainer}>
          <ChartComponent
            data={chartData}
            theme={theme}
            font={font}
            boldFont={boldFont}
            timeRange={timeRange}
            yKeys={["min", "avg", "max"]}
            barColor={theme.colors.error}
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

        <StatCard title="Statistics" stats={stats} icon="chart-line" color={theme.colors.error} />
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

export default HeartRateScreen;

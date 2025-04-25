import { View, StyleSheet } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { Icon, SegmentedButtons, Text, useTheme } from "react-native-paper";
import { StatCard } from "@/components/charts/StatsCard";
import SmartAreaView from "@/components/SmartAreaView";
import ChartComponent from "@/components/charts/Chart";
import useGetVisualizationData from "@/hooks/useGetVisualizationData";
import { useLocalSearchParams } from "expo-router";
import { fetchSPO2 } from "@/apis/healthAPI";

type TimeRange = "Hour" | "Day" | "Week";

function SPO2Screen() {
  const theme = useTheme();
  const font = useFont(require("../assets/fonts/Quicksand-Medium.ttf"), 15);
  const boldFont = useFont(require("../assets/fonts/Quicksand-Bold.ttf"), 15);
  const { email } = useLocalSearchParams<{ email?: string }>();
  const elderEmail = email || "";

  const { isError, isLoading, data, setTimeRange, timeRange } = useGetVisualizationData({
    elderEmail,
    fetchFn: fetchSPO2,
    metricKey: "spo2",
  });

  if (!font || !boldFont) return null;

  if (isError) {
    return <Text style={styles.centeredText}>Error loading data</Text>;
  }

  if (isLoading) {
    return <Text style={styles.centeredText}>Loading...</Text>;
  }

  if (!data || data.length === 0) {
    return <Text style={styles.centeredText}>No Blood Oxygen data available</Text>;
  }

  const min = Math.min(...data.map((d) => d.spo2.minSpO2 * 100));
  const avg = data.reduce((sum, item) => sum + item.spo2.avgSpO2 * 100, 0) / data.length;
  const max = Math.max(...data.map((d) => d.spo2.maxSpO2 * 100));

  const stats = [
    {
      label: "Min",
      value: Math.round(min),
      icon: "arrow-down" as const,
      color: theme.colors.primary,
    },
    {
      label: "Avg",
      value: Math.round(avg),
      icon: "trophy" as const,
      color: theme.colors.secondary,
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
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Blood Oxygen
          </Text>
          <Icon size={50} source="water" color={"#1e90ff"} />
        </View>
        <View style={styles.chartContainer}>
          <ChartComponent
            data={data.map((item) => ({
              day: new Date(item.spo2.timestamp).getTime(),
              min: item.spo2.minSpO2 * 100,
              avg: item.spo2.avgSpO2 * 100,
              max: item.spo2.maxSpO2 * 100,
            }))}
            theme={theme}
            font={font}
            boldFont={boldFont}
            timeRange={timeRange}
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

        <StatCard title="Statistics" stats={stats} icon="chart-line" color="blue" />
      </View>
    </SmartAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    paddingRight: 10,
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
  timestampContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
});

export default SPO2Screen;

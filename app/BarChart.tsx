import { View, StyleSheet } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { Icon, SegmentedButtons, Text, useTheme } from "react-native-paper";
import { StatCard } from "@/components/charts/StatsCard";
import SmartAreaView from "@/components/SmartAreaView";
import ChartComponent from "@/components/charts/Chart";
import useGetVisualizationData from "@/hooks/useGetVisualizationData";

type TimeRange = "Hour" | "Day" | "Week";

function LineChart() {
  const theme = useTheme();
  const font = useFont(require("../assets/fonts/Quicksand-Medium.ttf"), 15);
  const boldFont = useFont(require("../assets/fonts/Quicksand-Bold.ttf"), 15);
  const { isError, isLoading, data, setTimeRange, timeRange } = useGetVisualizationData("endpoint/url");

  if (!font || !boldFont) return null;

  if (isError) {
    return <Text>Error loading data</Text>;
  }

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!data) {
    return <Text>Problem fetching data</Text>;
  }

  const min = Math.min(...data.map((d) => d.min));
  const avg = data.reduce((sum, item) => sum + item.avg, 0) / data.length;
  const max = Math.max(...data.map((d) => d.max));

  const stats = [
    {
      label: "Min",
      value: min,
      icon: "arrow-down" as const,
      color: theme.colors.primary,
    },
    {
      label: "Avg",
      value: avg,
      icon: "trophy" as const,
      color: theme.colors.secondary,
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
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text variant={"headlineLarge"} style={styles.title}>
            Heart Rate
          </Text>
          <Icon size={50} source={"heart"} color={theme.colors.error} />
        </View>
        <View style={styles.chartContainer}>
          <ChartComponent data={DATA} theme={theme} font={font} boldFont={boldFont} />
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
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    padding: 10,
  },
  chartContainer: {
    width: "100%",
    flex: 1,
    padding: 10,
  },
  segmentedButtons: {
    alignSelf: "center",
    marginBottom: 10,
    maxWidth: "90%",
  },
});

const DATA = Array.from({ length: 60 }, (_, i) => {
  const base = 40 + 30 * Math.random();
  return {
    day: i + 1,
    min: base - 10 * Math.random(),
    avg: base,
    max: base + 10 * Math.random(),
  };
});

export default LineChart;

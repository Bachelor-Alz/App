import { View, StyleSheet } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { Icon, SegmentedButtons, Text, useTheme } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import { StatCard } from "@/components/charts/StatsCard";
import ChartComponent from "@/components/charts/Chart";
import useGetVisualizationData from "@/hooks/useGetVisualizationData";
import { useLocalSearchParams } from "expo-router";
import { fetchFallsData } from "@/apis/healthAPI";
import useLatestFallData from "@/hooks/useLatestFallData";
import ChartTitle from "@/components/charts/ChartTitle";

type TimeRange = "Hour" | "Day" | "Week";

const FallsCountScreen = () => {
  const theme = useTheme();
  const font = useFont(require("../assets/fonts/Quicksand-Medium.ttf"), 15);
  const boldFont = useFont(require("../assets/fonts/Quicksand-Bold.ttf"), 15);
  const { email } = useLocalSearchParams<{ email?: string }>();
  const elderEmail = email || "";

  const { isError, isLoading, data, setTimeRange, timeRange, timeFormat, navigateTime } =
    useGetVisualizationData({
      elderEmail,
      fetchFn: fetchFallsData,
      metricKey: "falls",
    });

  const filteredData = useLatestFallData(data || [], timeRange);

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

  if (isError || !filteredData || filteredData.length === 0) {
    return (
      <SmartAreaView>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.centeredText}>No Falls data available</Text>
        </View>
      </SmartAreaView>
    );
  }

  const fallsValues = filteredData.map((d) => Number(d.fallCount || 0));
  const avg = fallsValues.reduce((sum, val) => sum + val, 0) / fallsValues.length;
  const max = Math.max(...fallsValues);

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
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <ChartTitle
          title="Falls"
          timePeriod={timeFormat}
          icon="alert-circle"
          iconColor={"#ffa502"}
          navigateTime={navigateTime}
          theme={theme}
        />
        <View style={styles.chartContainer}>
          <ChartComponent
            data={filteredData.map((item) => ({
              day:
                timeRange === "Week"
                  ? new Date(item.timestamp).setHours(0, 0, 0, 0)
                  : new Date(item.timestamp).getTime(),
              min: 0,
              avg: Number(item.fallCount || 0),
              max: Number(item.fallCount || 0),
            }))}
            theme={theme}
            font={font}
            boldFont={boldFont}
            timeRange={timeRange}
          />
        </View>
        <SegmentedButtons
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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

export default FallsCountScreen;

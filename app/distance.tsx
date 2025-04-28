import { View, StyleSheet } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { Icon, SegmentedButtons, Text, useTheme } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import ChartComponent from "@/components/charts/Chart";
import { StatCard } from "@/components/charts/StatsCard";
import { useLocalSearchParams } from "expo-router";
import useGetVisualizationData from "@/hooks/useGetVisualizationData";
import { fetchDistance } from "@/apis/healthAPI";
import ChartTitle from "@/components/charts/ChartTitle";

type TimeRange = "Hour" | "Day" | "Week";

function DistanceScreen() {
  const theme = useTheme();
  const font = useFont(require("../assets/fonts/Quicksand-Medium.ttf"), 15);
  const boldFont = useFont(require("../assets/fonts/Quicksand-Bold.ttf"), 15);
  const { email } = useLocalSearchParams<{ email?: string }>();
  const elderEmail = email || "";

  const { isError, isLoading, data, setTimeRange, timeRange, navigateTime, timeFormat } =
    useGetVisualizationData({
      elderEmail,
      fetchFn: fetchDistance,
      metricKey: "distance",
    });

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

  if (isError || !data || data.length === 0) {
    return (
      <SmartAreaView>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.centeredText}>No Distance data available</Text>
        </View>
      </SmartAreaView>
    );
  }

  const distanceValues = data.map((d) => Number(d.distance || 0));
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
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <ChartTitle
          title="Distance"
          timePeriod={timeFormat}
          icon="walk"
          iconColor={"#ff7f50"}
          navigateTime={navigateTime}
          theme={theme}
        />

        <View style={styles.chartContainer}>
          <ChartComponent
            data={data.map((item) => ({
              day: new Date(item.timestamp).getTime(),
              min: 0,
              avg: Number(item.distance),
              max: Number(item.distance),
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

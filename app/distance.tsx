import React, { useMemo, useState } from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, Provider as PaperProvider } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useDistance } from "@/hooks/useHealth";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SmartAreaView from "@/components/SmartAreaView";
import MetricCircle from "@/components/MetricCircle";

const DistanceScreen = () => {
  const theme = useTheme();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const elderEmail = email || "";

  const [period, setPeriod] = useState<"Hour" | "Day" | "Week">("Hour");

  const handleRangeSelect = (range: string) => {
    if (range === "Hour") setPeriod("Hour");
    else if (range === "Day") setPeriod("Day");
    else if (range === "Week") setPeriod("Week");
  };

  const date = useMemo(() => new Date().toISOString(), []);
  const { data, isLoading, error } = useDistance(elderEmail, date, period);

  const backgroundColor = theme.dark ? "#000000" : "#ffffff";
  const colorOrange = "#ff7f50";

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (error || !data || data.length === 0) {
    return <Text style={{ marginTop: 100, textAlign: "center" }}>No Distance data available.</Text>;
  }

  const latest = data[0];

  const distance = latest.distance != null ? `${Math.round(Number(latest.distance))} km` : "N/A";

  return (
    <SmartAreaView>
      <View style={[styles.container, { backgroundColor }]}>
        <TimeRangeSelector onSelect={handleRangeSelect} />

        <MetricCircle
          icon={<Ionicons name="walk" size={64} color={colorOrange} />}
          value={distance}
          label="Distance"
          color={colorOrange}
        />
      </View>
    </SmartAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  distanceContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  distance: {
    fontSize: 32,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default () => (
  <PaperProvider>
    <DistanceScreen />
  </PaperProvider>
);

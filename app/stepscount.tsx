import React, { useMemo, useState } from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, Provider as PaperProvider } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useSteps } from "@/hooks/useHealth";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SmartAreaView from "@/components/SmartAreaView";

const StepsScreen = () => {
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
  const { data, isLoading, error } = useSteps(elderEmail, date, period);

  const backgroundColor = theme.dark ? "#000000" : "#ffffff";
  const colorGreen = "#2ed573";

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (error || !data || data.length === 0) {
    return <Text style={{ marginTop: 100, textAlign: "center" }}>No Steps data available.</Text>;
  }

  const latest = data[0];

  const steps = latest.stepsCount != null ? `${Math.round(Number(latest.stepsCount))} steps` : "N/A";

  return (
    <SmartAreaView>
      <View style={[styles.container, { backgroundColor }]}>
        <TimeRangeSelector onSelect={handleRangeSelect} />

        <View style={[styles.heartContainer, { backgroundColor, borderColor: colorGreen }]}>
          <Ionicons name="footsteps" size={64} color={colorGreen} />
          <Text style={[styles.heartRate, { color: theme.colors.onSurface }]}>{steps}</Text>
          <Text style={[styles.bpmText, { color: theme.colors.onSurface }]}>Steps</Text>
        </View>
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
  heartContainer: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginBottom: 20,
  },
  heartRate: {
    fontSize: 32,
    fontWeight: "bold",
  },
  bpmText: {
    fontSize: 18,
    color: "#888",
  },
});

export default () => (
  <PaperProvider>
    <StepsScreen />
  </PaperProvider>
);

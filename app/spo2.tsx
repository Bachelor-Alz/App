import React, { useMemo, useState } from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme, Provider as PaperProvider } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useSPO2 } from "@/hooks/useHealth";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SmartAreaView from "@/components/SmartAreaView";

const SPO2Screen = () => {
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
  const { data, isLoading, error } = useSPO2(elderEmail, date, period);

  const backgroundColor = theme.dark ? "#000000" : "#ffffff";
  const cardBackgroundColor = theme.dark ? "#1e1e1e" : "#f0f0f0";
  const colorBlue = "#1e90ff";

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (error || !data || data.length === 0) {
    return <Text style={{ marginTop: 100, textAlign: "center" }}>No SpO2 data available.</Text>;
  }

  const latest = data[0];

  const spo2 =
    latest.currentSpo2?.spO2 != null ? `${Math.round(Number(latest.currentSpo2.spO2) * 100)}%` : "N/A";

  const minSPO2 = latest.spo2?.minSpO2 != null ? `${Math.round(Number(latest.spo2.minSpO2) * 100)}%` : "N/A";

  const maxSPO2 = latest.spo2?.maxSpO2 != null ? `${Math.round(Number(latest.spo2.maxSpO2) * 100)}%` : "N/A";

  return (
    <SmartAreaView>
      <View style={[styles.container, { backgroundColor }]}>
        <TimeRangeSelector onSelect={handleRangeSelect} />

        <View style={[styles.heartContainer, { backgroundColor, borderColor: colorBlue }]}>
          <FontAwesome5 name="tint" size={64} color={colorBlue} />
          <Text style={[styles.heartRate, { color: theme.colors.onSurface }]}>{spo2}%</Text>
          <Text style={[styles.bpmText, { color: theme.colors.onSurface }]}>SpO2</Text>
        </View>

        <View
          style={[
            styles.infoBox,
            { backgroundColor: cardBackgroundColor, borderColor: theme.colors.outline },
          ]}>
          <Text style={[styles.infoLabel, { color: theme.colors.onSurface }]}>Min SpO2</Text>
          <View style={styles.infoValue}>
            <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>{minSPO2}%</Text>
            <Ionicons name="water" size={20} color={colorBlue} />
          </View>
        </View>

        <View
          style={[
            styles.infoBox,
            { backgroundColor: cardBackgroundColor, borderColor: theme.colors.outline },
          ]}>
          <Text style={[styles.infoLabel, { color: theme.colors.onSurface }]}>Max SpO2</Text>
          <View style={styles.infoValue}>
            <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>{maxSPO2}%</Text>
            <Ionicons name="water" size={20} color={colorBlue} />
          </View>
        </View>
      </View>
    </SmartAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  heartContainer: {
    width: 250,
    height: 250,
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  heartRate: {
    fontSize: 40,
    fontWeight: "bold",
  },
  bpmText: {
    fontSize: 18,
  },
  infoBox: {
    width: "90%",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  infoLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoValue: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
  },
});

export default () => (
  <PaperProvider>
    <SPO2Screen />
  </PaperProvider>
);

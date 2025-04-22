import React from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme, Provider as PaperProvider } from "react-native-paper";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SmartAreaView from "@/components/SmartAreaView";
import { useHeartRateDisplayData } from "@/hooks/useHeartRateDisplayData";

const HeartRateScreen = () => {
  const theme = useTheme();
  const { setPeriod, isLoading, error, hasData, heartRate, minBPM, maxBPM, restingHeartRate } =
    useHeartRateDisplayData();

  const backgroundColor = theme.dark ? "#000000" : "#ffffff";
  const cardBackgroundColor = theme.dark ? "#1e1e1e" : "#f0f0f0";

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (error || !hasData) {
    return <Text style={{ marginTop: 100, textAlign: "center" }}>No heart rate data available.</Text>;
  }

  return (
    <SmartAreaView>
      <View style={[styles.container, { backgroundColor }]}>
        <TimeRangeSelector onSelect={(range: string) => setPeriod(range as "Hour" | "Day" | "Week")} />
        <View style={[styles.heartContainer, { backgroundColor, borderColor: "#ff4757" }]}>
          <FontAwesome5 name="heartbeat" size={64} color="#ff4757" />
          <Text style={[styles.heartRate, { color: theme.colors.onSurface }]}>{heartRate}</Text>
          <Text style={[styles.bpmText, { color: theme.colors.onSurface }]}>BPM</Text>
        </View>

        {[
          { label: "Min Heart Rate", value: `${minBPM} BPM` },
          { label: "Max Heart Rate", value: `${maxBPM} BPM` },
          { label: "Resting Heart Rate", value: `${restingHeartRate} BPM` },
        ].map(({ label, value }) => (
          <View
            key={label}
            style={[
              styles.infoBox,
              { backgroundColor: cardBackgroundColor, borderColor: theme.colors.outline },
            ]}>
            <Text style={[styles.infoLabel, { color: theme.colors.onSurface }]}>{label}</Text>
            <View style={styles.infoValue}>
              <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>{value}</Text>
              <Ionicons name="heart" size={20} color="#ff4757" />
            </View>
          </View>
        ))}
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
    <HeartRateScreen />
  </PaperProvider>
);

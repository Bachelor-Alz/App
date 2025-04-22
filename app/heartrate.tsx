import React from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme, Provider as PaperProvider } from "react-native-paper";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SmartAreaView from "@/components/SmartAreaView";
import { useHeartRateDisplayData } from "@/hooks/useHeartRateDisplayData";
import MetricCircle from "@/components/MetricCircle";
import InfoBox from "@/components/InfoBox";

const HeartRateScreen = () => {
  const theme = useTheme();
  const { setPeriod, isLoading, error, hasData, heartRate, minBPM, maxBPM, restingHeartRate } =
    useHeartRateDisplayData();

  const backgroundColor = theme.dark ? "#000000" : "#ffffff";

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

        <MetricCircle
          icon={<FontAwesome5 name="heartbeat" size={64} color="#ff4757" />}
          value={heartRate}
          label="BPM"
          color="#ff4757"
        />

        <InfoBox
          label="Min Heart Rate"
          value={`${minBPM} BPM`}
          icon={<Ionicons name="heart" size={20} color="#ff4757" />}
        />
        <InfoBox
          label="Max Heart Rate"
          value={`${maxBPM} BPM`}
          icon={<Ionicons name="heart" size={20} color="#ff4757" />}
        />
        <InfoBox
          label="Resting Heart Rate"
          value={`${restingHeartRate} BPM`}
          icon={<Ionicons name="heart" size={20} color="#ff4757" />}
        />
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
});

export default () => (
  <PaperProvider>
    <HeartRateScreen />
  </PaperProvider>
);

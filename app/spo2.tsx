import React from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme, Provider as PaperProvider } from "react-native-paper";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SmartAreaView from "@/components/SmartAreaView";
import { useSPO2DisplayData } from "@/hooks/useSPO2DisplayData";
import MetricCircle from "@/components/MetricCircle";
import InfoBox from "@/components/InfoBox";

const SPO2Screen = () => {
  const theme = useTheme();
  const { setPeriod, isLoading, error, hasData, spo2, minSPO2, maxSPO2 } = useSPO2DisplayData();

  const backgroundColor = theme.dark ? "#000000" : "#ffffff";
  const colorBlue = "#1e90ff";

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (error || !hasData) {
    return <Text style={{ marginTop: 100, textAlign: "center" }}>No SpO2 data available.</Text>;
  }

  return (
    <SmartAreaView>
      <View style={[styles.container, { backgroundColor }]}>
        <TimeRangeSelector onSelect={(range: string) => setPeriod(range as "Hour" | "Day" | "Week")} />

        <MetricCircle
          icon={<Ionicons name="water" size={64} color={colorBlue} />}
          value={spo2}
          label="SpO2"
          color={colorBlue}
        />

        <InfoBox
          label="Min SpO2"
          value={`${minSPO2} %`}
          icon={<Ionicons name="water" size={20} color={colorBlue} />}
        />

        <InfoBox
          label="Max SpO2"
          value={`${maxSPO2} %`}
          icon={<Ionicons name="water" size={20} color={colorBlue} />}
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
    <SPO2Screen />
  </PaperProvider>
);

import React from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme, Provider as PaperProvider } from "react-native-paper";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SmartAreaView from "@/components/SmartAreaView";
import { useSPO2DisplayData } from "@/hooks/useSPO2DisplayData";

const SPO2Screen = () => {
  const theme = useTheme();
  const { setPeriod, isLoading, error, hasData, spo2, minSPO2, maxSPO2 } = useSPO2DisplayData();

  const backgroundColor = theme.dark ? "#000000" : "#ffffff";
  const cardBackgroundColor = theme.dark ? "#1e1e1e" : "#f0f0f0";
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

        <View style={[styles.spo2Container, { backgroundColor, borderColor: colorBlue }]}>
          <FontAwesome5 name="tint" size={64} color={colorBlue} />
          <Text style={[styles.spo2, { color: theme.colors.onSurface }]}>{spo2}</Text>
          <Text style={[styles.bpmText, { color: theme.colors.onSurface }]}>SpO2</Text>
        </View>

        {[
          { label: "Min SpO2", value: minSPO2 },
          { label: "Max SpO2", value: maxSPO2 },
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
              <Ionicons name="water" size={20} color={colorBlue} />
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
  spo2Container: {
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
  spo2: {
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

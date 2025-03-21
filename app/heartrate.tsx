import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme, Provider as PaperProvider } from "react-native-paper";

const HeartRateScreen = () => {
  const [heartRate] = useState(69);
  const [minBPM] = useState(42);
  const [maxBPM] = useState(131);
  const [restingHeartRate] = useState(58);
  const [heartRateVariability] = useState(110);

  const theme = useTheme();

  const backgroundColor = theme.dark ? "#000000" : "#ffffff";
  const cardBackgroundColor = theme.dark ? "#1e1e1e" : "#f0f0f0";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.heartContainer, { backgroundColor: backgroundColor, borderColor: "#ff4757" }]}>
        <FontAwesome5 name="heartbeat" size={64} color="#ff4757" />
        <Text style={[styles.heartRate, { color: theme.colors.onSurface }]}>{heartRate}</Text>
        <Text style={[styles.bpmText, { color: theme.colors.onSurface }]}>BPM</Text>
      </View>

      <View style={styles.minMaxContainer}>
        <Text style={[styles.minMaxText, { color: theme.colors.onBackground }]}>MIN: {minBPM} BPM</Text>
        <Text style={[styles.minMaxText, { color: theme.colors.onBackground }]}>MAX: {maxBPM} BPM</Text>
      </View>

      <View style={[styles.infoBox, { backgroundColor: cardBackgroundColor, borderColor: theme.colors.outline }]}>
        <Text style={[styles.infoLabel, { color: theme.colors.onSurface }]}>Resting Heart Rate</Text>
        <View style={styles.infoValue}>
          <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>{restingHeartRate} BPM</Text>
          <Ionicons name="heart" size={20} color="#ff4757" />
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: cardBackgroundColor, borderColor: theme.colors.outline }]}>
        <Text style={[styles.infoLabel, { color: theme.colors.onSurface }]}>Heart Rate Variability</Text>
        <View style={styles.infoValue}>
          <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>{heartRateVariability} ms</Text>
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: cardBackgroundColor, borderColor: theme.colors.outline }]}>
        <Text style={[styles.infoLabel, { color: theme.colors.onSurface }]}>Walking Heart Rate</Text>
        <View style={styles.infoValue}>
          <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>113 BPM</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heartContainer: {
    width: 250,
    height: 250,
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5, // For Android
  },
  heartRate: {
    fontSize: 40,
    fontWeight: "bold",
  },
  bpmText: {
    fontSize: 18,
  },
  minMaxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 15,
  },
  minMaxText: {
    fontSize: 16,
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
    elevation: 5, // For Android
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

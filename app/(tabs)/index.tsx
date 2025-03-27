import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme, Provider as PaperProvider, Button } from "react-native-paper";

type HealthData = {
  title: string;
  value: string;
  onPress?: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const healthData: HealthData[] = [
  {
    title: "Heart Rate",
    value: "62 BPM",
    icon: "heart",
    color: "#ff4757",
    onPress: () => router.push("/heartrate"),
  },
  {
    title: "Blood Oxygen Level",
    value: "98%",
    icon: "water",
    color: "#1e90ff",
  },
  {
    title: "Steps",
    value: "8,560",
    icon: "footsteps",
    color: "#2ed573",
  },
  {
    title: "Recorded Falls",
    value: "2",
    icon: "alert-circle",
    color: "#ffa502",
  },
  {
    title: "Distance Walked",
    value: "4.5 km",
    icon: "walk",
    color: "#ff7f50",
  },
  {
    title: "Location",
    value: "Home",
    icon: "location",
    color: "#ff6348",
  },
];

const HealthCard: React.FC<HealthData> = ({ title, value, icon, color, onPress }) => {
  const theme = useTheme();
  const cardBackgroundColor = theme.dark ? "#1e1e1e" : "#ffffff";

  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 10 }}>
      <View style={[styles.card, { backgroundColor: cardBackgroundColor, borderLeftColor: color }]}>
        <Ionicons name={icon} size={32} color={color} style={styles.icon} />
        <View>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>{title}</Text>
          <Text style={[styles.cardValue, { color: theme.colors.onSurface }]}>{value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const theme = useTheme();
  const backgroundColor = theme.dark ? "#000000" : "#f9f9f9";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View style={styles.container}>
        <Button mode="contained" onPress={() => router.push("/vitoryChart")} style={{ marginTop: 20 }}>
          Go to victoryChart
        </Button>
        <Text style={[styles.header, { color: theme.colors.onBackground }]}>Health Summary</Text>
        <FlatList
          data={healthData}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <HealthCard
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
              onPress={item.onPress}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  icon: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default () => (
  <PaperProvider>
    <HomeScreen />
  </PaperProvider>
);

import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme, Provider as PaperProvider } from "react-native-paper";
import { MD3Theme as Theme } from "react-native-paper";
import { useDashBoardData } from "@/hooks/useGetDashboardData";

type HealthData = {
  title: string;
  value: string;
  onPress?: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  theme: Theme;
};

const HealthCard: React.FC<HealthData> = ({ title, value, icon, color, onPress, theme }) => {
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
  const theme: Theme = useTheme();
  const backgroundColor = theme.dark ? "#000000" : "#f9f9f9";

  const { name, email } = useLocalSearchParams<{ name?: string; email?: string }>();
  const elderEmail = email || "";

  const { error, isLoading, data } = useDashBoardData(elderEmail);
  const healthData: HealthData[] = data
    ? [
        {
          title: "Heart Rate",
          value: `${data.heartRate ?? "N/A"} BPM`,
          icon: "heart",
          color: "#ff4757",
          onPress: () => router.push({ pathname: "/heartrate", params: { email: elderEmail } }),
          theme,
        },
        {
          title: "Blood Oxygen Level",
          value: data.spO2 != null ? `${Math.round(Number(data.spO2) * 100)}%` : "N/A",
          icon: "water",
          color: "#1e90ff",
          onPress: () => router.push({ pathname: "/spo2", params: { email: elderEmail } }),
          theme,
        },
        {
          title: "Steps",
          value: `${data.steps ?? "N/A"}`,
          icon: "footsteps",
          color: "#2ed573",
          onPress: () => router.push({ pathname: "/stepscount", params: { email: elderEmail } }),
          theme,
        },
        {
          title: "Recorded Falls",
          value: `${data.allFall ?? "N/A"}`,
          icon: "alert-circle",
          color: "#ffa502",
          onPress: () => router.push({ pathname: "/fallscount", params: { email: elderEmail } }),
          theme,
        },
        {
          title: "Distance Walked",
          value: `${data.distance?.toFixed(2) ?? "N/A"} km`,
          icon: "walk",
          color: "#ff7f50",
          onPress: () => router.push({ pathname: "/distance", params: { email: elderEmail } }),
          theme,
        },
      ]
    : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.colors.onBackground }]}>
          {name ? `${name}'s Health Summary` : "Health Summary"}
        </Text>
        {email && <Text style={{ color: theme.colors.onSurface, marginBottom: 10 }}>{email}</Text>}

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={{ color: theme.colors.error, marginTop: 30, fontSize: 16 }}>
            Failed to load health data.
          </Text>
        ) : (
          <FlatList
            data={healthData}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => <HealthCard {...item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    marginBottom: 5,
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
    elevation: 5,
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

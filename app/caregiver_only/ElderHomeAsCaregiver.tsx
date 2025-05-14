import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text, MD3Theme } from "react-native-paper";
import { useDashBoardData } from "@/hooks/useGetDashboardData";
import { HealthCardList } from "@/components/HealthCardList";
import { Ionicons } from "@expo/vector-icons";
import SmartAreaView from "@/components/SmartAreaView";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeNavigationProp, CompositeScreenProps } from "@react-navigation/native";
import { BottomTabNavigationProp, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CaregiverTabParamList, SharedHealthStackParamList } from "../navigation/navigation";

function buildHealthSummary(
  data: { heartRate: number; spO2: number; steps: number; distance: number; fallCount: number } | undefined,
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<CaregiverTabParamList, "ElderHomeAsCaregiver", undefined>,
    NativeStackNavigationProp<SharedHealthStackParamList, keyof SharedHealthStackParamList, undefined>
  >,
  elderId: string,
  theme: MD3Theme
) {
  return [
    {
      title: "Heart Rate",
      value: `${data?.heartRate ?? "N/A"} BPM`,
      icon: "heart" as keyof typeof Ionicons.glyphMap,
      color: "#ff4757",
      onPress: () => navigation.navigate("HeartRate", { id: elderId }),
      theme,
    },
    {
      title: "Blood Oxygen Level",
      value: data?.spO2 != null ? `${Math.round(Number(data.spO2) * 100)}%` : "N/A",
      icon: "water" as keyof typeof Ionicons.glyphMap,
      color: "#1e90ff",
      onPress: () => navigation.navigate("SPO2", { id: elderId }),
      theme,
    },
    {
      title: "Steps",
      value: `${data?.steps ?? "N/A"}`,
      icon: "footsteps" as keyof typeof Ionicons.glyphMap,
      color: "#2ed573",
      onPress: () => navigation.navigate("Steps", { id: elderId }),
      theme,
    },
    {
      title: "Recorded Falls",
      value: `${data?.fallCount ?? "N/A"}`,
      icon: "alert-circle" as keyof typeof Ionicons.glyphMap,
      color: "#ffa502",
      onPress: () => navigation.navigate("Fall", { id: elderId }),
      theme,
    },
    {
      title: "Distance Walked",
      value: `${data?.distance?.toFixed(2) ?? "N/A"} km`,
      icon: "walk" as keyof typeof Ionicons.glyphMap,
      color: "#ff7f50",
      onPress: () => navigation.navigate("Distance", { id: elderId }),
      theme,
    },
  ];
}

type ElderDashboardScreenProps = CompositeScreenProps<
  BottomTabScreenProps<CaregiverTabParamList, "ElderHomeAsCaregiver">,
  NativeStackScreenProps<SharedHealthStackParamList>
>;

function ElderHomeAsCaregiverPage({ navigation, route }: ElderDashboardScreenProps) {
  const theme = useTheme();
  const elderId = route.params.elderId;

  const { data } = useDashBoardData(elderId);

  const healthData = buildHealthSummary(data, navigation, elderId, theme);

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text variant="headlineLarge" style={[styles.header, { color: theme.colors.onBackground }]}>
            Dashboard
          </Text>
        </View>
        <HealthCardList healthData={healthData} />
      </View>
    </SmartAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  statusIcon: {
    marginLeft: 20,
  },
});

export default ElderHomeAsCaregiverPage;

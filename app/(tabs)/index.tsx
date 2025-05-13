import React from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useTheme, Text, Tooltip } from "react-native-paper";
import { useDashBoardData } from "@/hooks/useGetDashboardData";
import { router, useLocalSearchParams } from "expo-router";
import { CaregiverCardList } from "@/components/CaregiverCardList";
import { HealthCardList } from "@/components/HealthCardList";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { Ionicons } from "@expo/vector-icons";
import { useTestArduinoConnection } from "@/hooks/useElders";
import { useToast } from "@/providers/ToastProvider";
import { testArduinoConnection } from "@/apis/elderAPI";
import SmartAreaView from "@/components/SmartAreaView";

const MainPage = () => {
  const theme = useTheme();
  const { addToast } = useToast();

  const queryFn = async () => {
    if (roleFromParams === 1) {
      try {
        const res = await testArduinoConnection();
        if (!res) {
          addToast("Arduino is not connected", "error");
          Alert.alert("Arduino is not connected", undefined, [
            {
              text: "Go to Settings",
              onPress: () => router.push("/settings/viewarduino"),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]);
        }
        return res;
      } catch (err) {
        addToast("Arduino connection failed", "Cannot connect to server");
        return false;
      }
    }
    return false;
  };

  const {
    name,
    id,
    role: elderRoleParam,
  } = useLocalSearchParams<{
    name?: string;
    id?: string;
    role?: string;
  }>();

  const { role, userId } = useAuthentication();

  const roleFromParams = parseInt(elderRoleParam ?? "") || role;

  const elderId = id || userId || "";
  const { error, isLoading, data } = useDashBoardData(elderId);
  const { data: arduinoStatus, isLoading: arduinoLoading } = useTestArduinoConnection(elderId, queryFn);

  const healthData = data
    ? [
        {
          title: "Heart Rate",
          value: `${data.heartRate ?? "N/A"} BPM`,
          icon: "heart" as keyof typeof Ionicons.glyphMap,
          color: "#ff4757",
          onPress: () => router.push({ pathname: "/heartrate", params: { id: elderId } }),
          theme,
        },
        {
          title: "Blood Oxygen Level",
          value: data.spO2 != null ? `${Math.round(Number(data.spO2) * 100)}%` : "N/A",
          icon: "water" as keyof typeof Ionicons.glyphMap,
          color: "#1e90ff",
          onPress: () => router.push({ pathname: "/spo2", params: { id: elderId } }),
          theme,
        },
        {
          title: "Steps",
          value: `${data.steps ?? "N/A"}`,
          icon: "footsteps" as keyof typeof Ionicons.glyphMap,
          color: "#2ed573",
          onPress: () => router.push({ pathname: "/stepscount", params: { id: elderId } }),
          theme,
        },
        {
          title: "Recorded Falls",
          value: `${data.fallCount ?? "N/A"}`,
          icon: "alert-circle" as keyof typeof Ionicons.glyphMap,
          color: "#ffa502",
          onPress: () => router.push({ pathname: "/fallscount", params: { id: elderId } }),
          theme,
        },
        {
          title: "Distance Walked",
          value: `${data.distance?.toFixed(2) ?? "N/A"} km`,
          icon: "walk" as keyof typeof Ionicons.glyphMap,
          color: "#ff7f50",
          onPress: () => router.push({ pathname: "/distance", params: { id: elderId } }),
          theme,
        },
      ]
    : [];

  const caregiverOptions = [
    {
      title: "View Invitations",
      value: "See caregiver invites from elders",
      icon: "mail-open" as keyof typeof Ionicons.glyphMap,
      color: "#1e90ff",
      onPress: () => router.push("/settings/viewcaregiverinvites"),
      theme,
    },
    {
      title: "View Assigned Elders",
      value: "See all elders assigned to you",
      icon: "people" as keyof typeof Ionicons.glyphMap,
      color: "#2ed573",
      onPress: () => router.push("/settings/viewelder"),
      theme,
    },
    {
      title: "Elder Map",
      value: "View your associated elders on a map",
      icon: "map" as keyof typeof Ionicons.glyphMap,
      color: "#ff4757",
      onPress: () => router.push("/settings/map"),
      theme,
    },
  ];

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text variant="headlineLarge" style={[styles.header, { color: theme.colors.onBackground }]}>
            {name ? `${name}'s Dashboard` : "Dashboard"}
          </Text>
          {roleFromParams === 1 && (
            <View>
              <Tooltip
                title={
                  arduinoLoading
                    ? "Loading..."
                    : arduinoStatus
                    ? "Connected to device"
                    : "Not Connected to device"
                }>
                <Ionicons
                  name="bluetooth"
                  size={40}
                  color={
                    arduinoLoading ? theme.colors.outline : arduinoStatus ? "#2ed573" : theme.colors.error
                  }
                  style={styles.statusIcon}
                />
              </Tooltip>
            </View>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={{ color: theme.colors.error, marginTop: 30, fontSize: 16 }}>Failed to load data.</Text>
        ) : (
          <>
            {roleFromParams === 0 ? (
              <CaregiverCardList healthData={caregiverOptions} />
            ) : roleFromParams === 1 ? (
              <HealthCardList healthData={healthData} />
            ) : (
              <Text style={{ color: theme.colors.error, marginTop: 30, fontSize: 16 }}>Invalid role.</Text>
            )}
          </>
        )}
      </View>
    </SmartAreaView>
  );
};

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

export default MainPage;

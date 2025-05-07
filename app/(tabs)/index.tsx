import React from "react";
import { View, Text, SafeAreaView, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useTheme, Provider as PaperProvider } from "react-native-paper";
import { useDashBoardData } from "@/hooks/useGetDashboardData";
import { router, useLocalSearchParams } from "expo-router";
import { CaregiverCardList } from "@/components/CaregiverCardList";
import { HealthCardList } from "@/components/HealthCardList";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { Ionicons } from "@expo/vector-icons";
import { useTestArduinoConnection } from "@/hooks/useElders";
import { useToast } from "@/providers/ToastProvider";
import { testArduinoConnection } from "@/apis/elderAPI";

const MainPage = () => {
  const theme = useTheme();
  const backgroundColor = theme.dark ? "#000000" : theme.colors.surface;
  const { addToast } = useToast();

  const queryFn = async (email: string) => {
    if (roleFromParams === 1) {
      try {
        const res = await testArduinoConnection(email);
        if (!res) {
          addToast("Arduino is not connected", "error");
          Alert.alert("Arduino is not connected", undefined, [
            {
              text: "Go to Settings",
              onPress: () => router.push("/viewarduino"),
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
    email,
    role: elderRoleParam,
  } = useLocalSearchParams<{
    name?: string;
    email?: string;
    role?: string;
  }>();

  const { role } = useAuthentication();

  const roleFromParams = parseInt(elderRoleParam ?? "") || role;

  const elderEmail = email || "";

  const { error, isLoading, data } = useDashBoardData(elderEmail);
  const { data: arduinoStatus, isLoading: arduinoLoading } = useTestArduinoConnection(elderEmail, queryFn);

  const healthData = data
    ? [
        {
          title: "Heart Rate",
          value: `${data.heartRate ?? "N/A"} BPM`,
          icon: "heart" as keyof typeof Ionicons.glyphMap,
          color: "#ff4757",
          onPress: () => router.push({ pathname: "/heartrate", params: { email: elderEmail } }),
        },
        {
          title: "Blood Oxygen Level",
          value: data.spO2 != null ? `${Math.round(Number(data.spO2) * 100)}%` : "N/A",
          icon: "water" as keyof typeof Ionicons.glyphMap,
          color: "#1e90ff",
          onPress: () => router.push({ pathname: "/spo2", params: { email: elderEmail } }),
        },
        {
          title: "Steps",
          value: `${data.steps ?? "N/A"}`,
          icon: "footsteps" as keyof typeof Ionicons.glyphMap,
          color: "#2ed573",
          onPress: () => router.push({ pathname: "/stepscount", params: { email: elderEmail } }),
        },
        {
          title: "Recorded Falls",
          value: `${data.allFall ?? "N/A"}`,
          icon: "alert-circle" as keyof typeof Ionicons.glyphMap,
          color: "#ffa502",
          onPress: () => router.push({ pathname: "/fallscount", params: { email: elderEmail } }),
        },
        {
          title: "Distance Walked",
          value: `${data.distance?.toFixed(2) ?? "N/A"} km`,
          icon: "walk" as keyof typeof Ionicons.glyphMap,
          color: "#ff7f50",
          onPress: () => router.push({ pathname: "/distance", params: { email: elderEmail } }),
        },
      ]
    : [];

  const caregiverOptions = [
    {
      title: "View Invitations",
      value: "See caregiver invites from elders",
      icon: "mail-open" as keyof typeof Ionicons.glyphMap,
      color: "#1e90ff",
      onPress: () => router.push("/viewcaregiverinvites"),
    },
    {
      title: "View Assigned Elders",
      value: "See all elders assigned to you",
      icon: "people" as keyof typeof Ionicons.glyphMap,
      color: "#2ed573",
      onPress: () => router.push("/viewelder"),
    },
    {
      title: "Elder Map",
      value: "View your associated elders on a map",
      icon: "map" as keyof typeof Ionicons.glyphMap,
      color: "#ff4757",
      onPress: () => router.push("/map"),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={[styles.header, { color: theme.colors.onBackground }]}>
            {name ? `${name}'s Dashboard` : "Dashboard"}
          </Text>
          {roleFromParams === 1 && (
            <Ionicons
              name="bluetooth"
              size={34}
              color={arduinoLoading ? theme.colors.outline : arduinoStatus ? "#2ed573" : theme.colors.error}
              style={styles.statusIcon}
            />
          )}
        </View>
        {email && <Text style={{ color: theme.colors.onSurface, marginBottom: 10 }}>{email}</Text>}

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={{ color: theme.colors.error, marginTop: 30, fontSize: 16 }}>Failed to load data.</Text>
        ) : (
          <>
            {roleFromParams === 0 ? (
              <CaregiverCardList caregiverOptions={caregiverOptions} />
            ) : roleFromParams === 1 ? (
              <HealthCardList healthData={healthData} />
            ) : (
              <Text style={{ color: theme.colors.error, marginTop: 30, fontSize: 16 }}>Invalid role.</Text>
            )}
          </>
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

export default () => (
  <PaperProvider>
    <MainPage />
  </PaperProvider>
);

import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useTheme, Text, Tooltip } from "react-native-paper";
import { useDashBoardData } from "@/hooks/useGetDashboardData";
import { HealthCardList } from "@/components/HealthCardList";
import { useAuthenticatedUser } from "@/providers/AuthenticationProvider";
import { Ionicons } from "@expo/vector-icons";
import { useTestArduinoConnection } from "@/hooks/useElders";
import { useToast } from "@/providers/ToastProvider";
import { testArduinoConnection } from "@/apis/elderAPI";
import SmartAreaView from "@/components/SmartAreaView";
import { ElderTabParamList } from "./navigation/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<ElderTabParamList, "Home">;

const ElderHomePage = ({ navigation }: Props) => {
  const theme = useTheme();
  const { addToast } = useToast();

  const queryFn = async () => {
    if (role === 1) {
      try {
        const res = await testArduinoConnection();
        if (!res) {
          addToast("Arduino is not connected", "error");
          Alert.alert("Arduino is not connected", undefined, [
            {
              text: "Go to Settings",
              onPress: () => navigation.push("/settings/viewarduino"),
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

  const { role, userId } = useAuthenticatedUser();

  const { error, isLoading, data } = useDashBoardData(userId);
  const { data: arduinoStatus, isLoading: arduinoLoading } = useTestArduinoConnection(userId, queryFn);

  const healthData = data
    ? [
        {
          title: "Heart Rate",
          value: `${data.heartRate ?? "N/A"} BPM`,
          icon: "heart" as keyof typeof Ionicons.glyphMap,
          color: "#ff4757",
          onPress: () => navigation.push({ pathname: "/heartrate", params: { id: userId } }),
          theme,
        },
        {
          title: "Blood Oxygen Level",
          value: data.spO2 != null ? `${Math.round(Number(data.spO2) * 100)}%` : "N/A",
          icon: "water" as keyof typeof Ionicons.glyphMap,
          color: "#1e90ff",
          onPress: () => navigation.push({ pathname: "/spo2", params: { id: elderId } }),
          theme,
        },
        {
          title: "Steps",
          value: `${data.steps ?? "N/A"}`,
          icon: "footsteps" as keyof typeof Ionicons.glyphMap,
          color: "#2ed573",
          onPress: () => navigation.push({ pathname: "/stepscount", params: { id: elderId } }),
          theme,
        },
        {
          title: "Recorded Falls",
          value: `${data.fallCount ?? "N/A"}`,
          icon: "alert-circle" as keyof typeof Ionicons.glyphMap,
          color: "#ffa502",
          onPress: () => navigation.push({ pathname: "/fallscount", params: { id: elderId } }),
          theme,
        },
        {
          title: "Distance Walked",
          value: `${data.distance?.toFixed(2) ?? "N/A"} km`,
          icon: "walk" as keyof typeof Ionicons.glyphMap,
          color: "#ff7f50",
          onPress: () => navigation.push({ pathname: "/distance", params: { id: elderId } }),
          theme,
        },
      ]
    : [];

  const ToolTipTitle = arduinoLoading
    ? "Loading..."
    : arduinoStatus
    ? "Connected to device"
    : "Not Connected to device";

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text variant="headlineLarge" style={[styles.header, { color: theme.colors.onBackground }]}>
            {"Dashboard"}
          </Text>

          <View>
            <Tooltip title={ToolTipTitle}>
              <Ionicons
                name="bluetooth"
                size={40}
                color={arduinoLoading ? theme.colors.outline : arduinoStatus ? "#2ed573" : theme.colors.error}
                style={styles.statusIcon}
              />
            </Tooltip>
          </View>
        </View>
        <HealthCardList healthData={healthData} />
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

export default ElderHomePage;

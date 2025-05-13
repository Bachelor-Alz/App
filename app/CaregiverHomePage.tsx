import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { CaregiverCardList } from "@/components/CaregiverCardList";
import { Ionicons } from "@expo/vector-icons";
import SmartAreaView from "@/components/SmartAreaView";

const CaregiverHomePage = ({ navigation }) => {
  const theme = useTheme();

  const caregiverOptions = [
    {
      title: "View Invitations",
      value: "See caregiver invites from elders",
      icon: "mail-open" as keyof typeof Ionicons.glyphMap,
      color: "#1e90ff",
      onPress: () => navigation.push("/settings/viewcaregiverinvites"),
      theme,
    },
    {
      title: "View Assigned Elders",
      value: "See all elders assigned to you",
      icon: "people" as keyof typeof Ionicons.glyphMap,
      color: "#2ed573",
      onPress: () => navigation.push("/settings/viewelder"),
      theme,
    },
    {
      title: "Elder Map",
      value: "View your associated elders on a map",
      icon: "map" as keyof typeof Ionicons.glyphMap,
      color: "#ff4757",
      onPress: () => navigation.push("/settings/map"),
      theme,
    },
  ];

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text variant="headlineLarge" style={[styles.header, { color: theme.colors.onBackground }]}>
            Dashboard
          </Text>
        </View>
        <CaregiverCardList healthData={caregiverOptions} />
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

export default CaregiverHomePage;

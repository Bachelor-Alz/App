import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import SmartAreaView from "@/components/SmartAreaView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CaregiverTabParamList } from "../navigation/navigation";
import { HealthCardList } from "@/components/HealthCardList";
type Props = NativeStackScreenProps<CaregiverTabParamList, "Home">;

const CaregiverHomePage = ({ navigation }: Props) => {
  const theme = useTheme();

  const caregiverOptions = [
    {
      title: "View Invitations",
      value: "See invites from elders",
      icon: "mail-open" as keyof typeof Ionicons.glyphMap,
      color: "#1e90ff",
      onPress: () => navigation.push("CaregiverInvites"),
      theme,
    },
    {
      title: "View Elders",
      value: "See all elders",
      icon: "people" as keyof typeof Ionicons.glyphMap,
      color: "#2ed573",
      onPress: () => navigation.push("ViewElder"),
      theme,
    },
    {
      title: "Elder Map",
      value: "View elders on map",
      icon: "map" as keyof typeof Ionicons.glyphMap,
      color: "#ff4757",
      onPress: () => navigation.push("MapCaregiver"),
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
        <HealthCardList healthData={caregiverOptions} />
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

import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme, Provider as PaperProvider } from "react-native-paper";

type CaregiverOption = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

const caregiverOptions: CaregiverOption[] = [
  {
    title: "View Invitations",
    subtitle: "See caregiver invites from elders",
    icon: "mail-open",
    color: "#1e90ff",
    onPress: () => router.push("/viewcaregiverinvites"),
  },
  {
    title: "View Assigned Elders",
    subtitle: "See all elders assigned to you",
    icon: "people",
    color: "#2ed573",
    onPress: () => router.push("/viewelder"),
  },
];

const CaregiverCard: React.FC<CaregiverOption> = ({ title, subtitle, icon, color, onPress }) => {
  const theme = useTheme();
  const cardBackgroundColor = theme.dark ? "#1e1e1e" : "#ffffff";

  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 10 }}>
      <View style={[styles.card, { backgroundColor: cardBackgroundColor, borderLeftColor: color }]}>
        <Ionicons name={icon} size={32} color={color} style={styles.icon} />
        <View>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>{title}</Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CaregiverOverview = () => {
  const theme = useTheme();
  const backgroundColor = theme.dark ? "#000000" : "#f9f9f9";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.colors.onBackground }]}>Caregiver Dashboard</Text>
        <FlatList
          data={caregiverOptions}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <CaregiverCard
              title={item.title}
              subtitle={item.subtitle}
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
    elevation: 5,
  },
  icon: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default () => (
  <PaperProvider>
    <CaregiverOverview />
  </PaperProvider>
);

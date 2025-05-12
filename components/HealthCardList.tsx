import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MD3Theme, useTheme } from "react-native-paper";

export type HealthCardProps = {
  title: string;
  value: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color: string;
  theme: MD3Theme;
};

export type HealthCardListProps = {
  healthData: HealthCardProps[];
};

export const HealthCard: React.FC<HealthCardProps> = ({ title, value, icon, color, onPress, theme }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.card, { backgroundColor: theme.colors.elevation.level1, borderLeftColor: color }]}>
        <Ionicons name={icon} size={50} color={color} />
        <View>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>{title}</Text>
          <Text style={[styles.cardValue, { color: theme.colors.onSurface }]}>{value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const HealthCardList: React.FC<HealthCardListProps> = ({ healthData }) => {
  const theme = useTheme();

  return (
    <FlatList
      data={healthData}
      keyExtractor={(item) => item.title}
      contentContainerStyle={{ gap: 20 }}
      renderItem={({ item }) => <HealthCard {...item} theme={theme} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 25,
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    gap: 20,
  },
  cardTitle: {
    fontSize: 18,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

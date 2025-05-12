import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { HealthCard, HealthCardListProps } from "./HealthCardList";

export const CaregiverCardList: React.FC<HealthCardListProps> = ({ healthData }) => {
  return (
    <FlatList
      data={healthData}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => <HealthCard {...item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
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

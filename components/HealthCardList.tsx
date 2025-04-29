import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

type HealthCardProps = {
  title: string;
  value: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color: string;
};

const HealthCard: React.FC<HealthCardProps> = ({ title, value, icon, color, onPress }) => {
  const theme = useTheme();
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

type HealthCardListProps = {
  healthData: HealthCardProps[];
};

export const HealthCardList: React.FC<HealthCardListProps> = ({ healthData }) => {
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
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

import React from "react";
import { Card, Divider, Text } from "react-native-paper";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Stat = {
  label: string;
  value: number;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color?: string;
};

type StatCardProps = {
  title: string;
  stats: Stat[];
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color?: string;
};

export function StatCard({ title, stats, icon, color }: StatCardProps) {
  return (
    <Card style={{ margin: 10, padding: 10, width: "90%" }}>
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 13 }}>
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={color ?? "black"}
            style={{ marginRight: 10 }}
          />
          <Text variant="titleLarge">{title}</Text>
        </View>
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 8 }}>
              <Text variant="titleMedium">{stat.label}</Text>
              <Text variant="titleMedium">{stat.value.toFixed(2)}</Text>
              {stat.icon && (
                <MaterialCommunityIcons
                  name={stat.icon}
                  size={25}
                  color={stat.color ?? "black"}
                  style={{ marginLeft: 10 }}
                />
              )}
            </View>
            {index < stats.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card.Content>
    </Card>
  );
}

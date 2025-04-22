import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

interface MetricCircleProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  size?: number;
  style?: ViewStyle;
}

const MetricCircle: React.FC<MetricCircleProps> = ({ icon, value, label, color, size = 250, style }) => {
  const theme = useTheme();
  const backgroundColor = theme.dark ? "#000000" : "#ffffff";

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          backgroundColor,
        },
        style,
      ]}>
      {icon}
      <Text style={[styles.value, { color: theme.colors.onSurface }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  value: {
    fontSize: 40,
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
  },
});

export default MetricCircle;

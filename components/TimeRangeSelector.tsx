import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { createTheme } from "@/constants/CreateTheme";

const timeRanges = ["Hour", "Day", "Week"];

type TimeRangeSelectorProps = {
  onSelect: (range: string) => void;
};

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ onSelect }) => {
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === "dark");
  const [selectedRange, setSelectedRange] = useState("H");

  const handlePress = (range: string) => {
    setSelectedRange(range);
    onSelect(range);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.dark ? "#1e1e1e" : "#f0f0f0",
          borderColor: theme.colors.outline,
        },
      ]}>
      {timeRanges.map((range) => {
        const isSelected = selectedRange === range;
        return (
          <TouchableOpacity
            key={range}
            style={[
              styles.button,
              {
                backgroundColor: isSelected ? theme.colors.primary : "transparent",
                borderColor: theme.colors.outline,
              },
            ]}
            onPress={() => handlePress(range)}>
            <Text
              style={[
                styles.text,
                {
                  color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface,
                },
              ]}>
              {range}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
    marginBottom: 16,
    alignSelf: "stretch",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TimeRangeSelector;

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const timeRanges = ["H", "D", "W", "M", "6M", "Y"];

type TimeRangeSelectorProps = {
  onSelect: (range: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ onSelect }) => {
  const [selectedRange, setSelectedRange] = useState("H");

  const handlePress = (range: string) => {
    setSelectedRange(range);
    onSelect(range);
  };

  return (
    <View style={styles.container}>
      {timeRanges.map((range) => (
        <TouchableOpacity
          key={range}
          style={[styles.button, selectedRange === range && styles.selectedButton]}
          onPress={() => handlePress(range)}
        >
          <Text style={[styles.text, selectedRange === range && styles.selectedText]}>
            {range}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
    padding: 5,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "white",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    color: "black",
  },
});

export default TimeRangeSelector;

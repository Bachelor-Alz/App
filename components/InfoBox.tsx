import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

type InfoBoxProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  style?: ViewStyle;
};

const InfoBox: React.FC<InfoBoxProps> = ({ label, value, icon, style }) => {
  const theme = useTheme();
  const cardBackgroundColor = theme.dark ? "#1e1e1e" : "#f0f0f0";

  return (
    <View
      style={[
        styles.infoBox,
        { backgroundColor: cardBackgroundColor, borderColor: theme.colors.outline },
        style,
      ]}>
      <Text style={[styles.infoLabel, { color: theme.colors.onSurface }]}>{label}</Text>
      <View style={styles.infoValue}>
        <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>{value}</Text>
        {icon}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    width: "90%",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  infoLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoValue: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
  },
});

export default InfoBox;

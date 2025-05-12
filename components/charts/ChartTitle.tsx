import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet, Pressable } from "react-native";
import { MD3Theme, Text } from "react-native-paper";

export type ChartType = "bar" | "line";

type ChartTitleProps = {
  title: string;
  timePeriod: () => string;
  navigateTime: (direction: "prev" | "next") => void;
  theme: MD3Theme;
  chartType: ChartType;
  onChartTypeChange: React.Dispatch<React.SetStateAction<ChartType>>;
};

const ChartTitle = ({
  title,
  timePeriod,
  navigateTime,
  theme,
  chartType,
  onChartTypeChange,
}: ChartTitleProps) => {
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.titleAndIcon}>
          <Text variant="headlineMedium" style={styles.title}>
            {title}
          </Text>
        </View>
        <View style={styles.chartTypeButtonsContainer}>
          <Pressable onPress={() => onChartTypeChange("bar")}>
            <MaterialCommunityIcons
              name="chart-bar"
              size={24}
              color={chartType === "bar" ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
          </Pressable>
          <Pressable onPress={() => onChartTypeChange("line")}>
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color={chartType === "line" ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.subheader}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={30}
          onPress={() => navigateTime("prev")}
          color={theme.colors.onSurface}
        />
        <Text variant="titleMedium">{timePeriod()}</Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          onPress={() => navigateTime("next")}
          color={theme.colors.onSurface}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  titleAndIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    paddingRight: 10,
  },
  chartTypeButtonsContainer: {
    flexDirection: "row",
    gap: 15,
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    alignItems: "center",
  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 10,
  },
});

export default ChartTitle;

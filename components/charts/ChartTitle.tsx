import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { MD3Theme, Text } from "react-native-paper";

type ChartTitleProps = {
  title: string;
  timePeriod: () => string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconColor: string;
  navigateTime: (direction: "prev" | "next") => void;
  theme: MD3Theme;
};

const ChartTitle = ({ title, timePeriod, icon, iconColor, navigateTime, theme }: ChartTitleProps) => {
  return (
    <View>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>
        <MaterialCommunityIcons size={50} name={icon} color={iconColor} />
      </View>
      <View style={styles.subheader}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={30}
          onPress={() => navigateTime("prev")}
          color={theme.colors.backdrop}
        />
        <Text variant="titleMedium">{timePeriod()}</Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          onPress={() => navigateTime("next")}
          color={theme.colors.backdrop}
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
  },
  title: {
    paddingRight: 10,
  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

export default ChartTitle;

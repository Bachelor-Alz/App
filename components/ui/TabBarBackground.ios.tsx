import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabBarBackground() {
  const theme = useTheme();

  return (
    <BlurView
      tint={theme.dark ? "dark" : "light"}
      intensity={100}
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]}
    />
  );
}

export default TabBarBackground;

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}

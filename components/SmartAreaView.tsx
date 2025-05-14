import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, useTheme } from "react-native-paper";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import React from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const SmartAreaView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const currentRoute = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route;
  });

  const showBackButton = (() => {
    if (!currentRoute) return false;
    if (currentRoute.name === "Login" || currentRoute.name === "Register") return false;
    if (currentRoute.name === "Home" || currentRoute.name === "Settings") return false;
    return navigation.canGoBack();
  })();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {showBackButton && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.backButton}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon size={30} color={theme.colors.onSurface} source={"arrow-left"} />
          </Pressable>
        </Animated.View>
      )}
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    margin: 8,
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 10,
  },
});

export default SmartAreaView;

import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, useTheme } from "react-native-paper";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import React from "react";

const SmartAreaView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigation = useNavigation();
  const state = useNavigationState((state) => state);
  const theme = useTheme();
  const canGoBackInCurrentStack = state ? state.index > 0 : false;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Conditionally render the back button based on canGoBackInCurrentStack */}
      {canGoBackInCurrentStack && (
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          {/* Use theme colors obtained from the hook */}
          <Icon size={30} color={theme.colors.onSurface} source={"arrow-left"} />
        </Pressable>
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
    top: 30,
    left: 10,
    zIndex: 10,
  },
});

export default SmartAreaView;

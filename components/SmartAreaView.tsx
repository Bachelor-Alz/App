import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, MD3Theme, withTheme } from "react-native-paper";

const SmartAreaView: React.FC<{ children: React.ReactNode; theme: MD3Theme }> = ({ children, theme }) => {
  const backgroundColor = theme.dark ? "#000000" : theme.colors.surface;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {router.canGoBack() && (
        <Pressable style={styles.backButton} onPress={() => router.back()}>
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
    top: 50,
    left: 10,
    zIndex: 10,
  },
});

export default withTheme(SmartAreaView);

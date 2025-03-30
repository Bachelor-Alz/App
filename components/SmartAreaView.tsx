import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, MD3Theme, withTheme } from "react-native-paper";

const SmartAreaView: React.FC<{ children: React.ReactNode; theme: MD3Theme }> = ({ children, theme }) => {
  if (router.canGoBack()) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable
          style={{ margin: 8, position: "absolute", top: 50, left: 10, zIndex: 10 }}
          onPress={() => router.back()}>
          <Icon size={30} color={theme.colors.onSurface} source={"arrow-left"} />
        </Pressable>
        <>{children}</>
      </SafeAreaView>
    );
  }

  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default withTheme(SmartAreaView);

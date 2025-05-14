import React from "react";
import { View, StyleSheet } from "react-native";
import { List, Divider, Switch, Text } from "react-native-paper";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import SmartAreaView from "@/components/SmartAreaView";
import { useThemeContext } from "@/providers/ThemeProvider";

const SettingsPageCaregiver = () => {
  const { logout } = useAuthentication();
  const { toggleTheme, themeMode } = useThemeContext();

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <List.Section>
          <Text variant="headlineLarge" style={styles.header}>
            Settings
          </Text>
          <List.Item
            title={themeMode === "light" ? "Light Mode" : "Dark Mode"}
            titleStyle={styles.title}
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <Switch value={themeMode === "dark"} onValueChange={toggleTheme} />}
            onPress={toggleTheme}
            style={styles.item}
          />
          <Divider style={styles.divider} />

          <List.Item
            title="Logout"
            titleStyle={styles.title}
            left={() => <List.Icon icon="logout" />}
            onPress={logout}
            style={styles.item}
          />
        </List.Section>
      </View>
    </SmartAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
  },
  item: {
    paddingVertical: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#666",
    marginVertical: 8,
  },
});

export default SettingsPageCaregiver;

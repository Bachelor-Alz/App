import React from "react";
import { View, SafeAreaView, StyleSheet, Alert } from "react-native";
import { List, Divider, Switch } from "react-native-paper";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { router } from "expo-router";
import { removeArduinoFromElder } from "@/apis/elderAPI";
import SmartAreaView from "@/components/SmartAreaView";
import { useThemeContext } from "@/providers/ThemeProvider";

const Settings = () => {
  const { role, logout, userEmail } = useAuthentication();
  const { toggleTheme, themeMode } = useThemeContext();

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <List.Section>
          <List.Subheader style={styles.header}>Settings</List.Subheader>

          {role === 1 && (
            <>
              <List.Item
                title="Assign Caregiver"
                titleStyle={styles.title}
                left={() => <List.Icon icon="account-group" />}
                onPress={() => router.push("/settings/assigncaregiver")}
                style={styles.item}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Remove Caregiver"
                titleStyle={styles.title}
                left={() => <List.Icon icon="account-remove" />}
                onPress={() => router.push("/settings/removecaregiver")}
                style={styles.item}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Assign Arduino"
                titleStyle={styles.title}
                left={() => <List.Icon icon="bluetooth" />}
                onPress={() => router.push("/settings/viewarduino")}
                style={styles.item}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Home Perimeter"
                titleStyle={styles.title}
                left={() => <List.Icon icon="home" />}
                onPress={() =>
                  router.push({ pathname: "/settings/map_elder", params: { elderEmail: userEmail } })
                }
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Remove Arduino"
                titleStyle={styles.title}
                left={() => <List.Icon icon="bluetooth-off" />}
                onPress={() => {
                  Alert.alert("Confirm Removal", "Are you sure you want to remove your Arduino connection?", [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Remove",
                      style: "destructive",
                      onPress: () => removeArduinoFromElder(),
                    },
                  ]);
                }}
                style={styles.item}
              />
            </>
          )}
          <Divider style={styles.divider} />
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
    fontSize: 28,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
  },
  item: {
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#666",
    marginVertical: 8,
  },
});

export default Settings;

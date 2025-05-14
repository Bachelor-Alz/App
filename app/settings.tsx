import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { List, Divider, Switch, Text } from "react-native-paper";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { removeArduinoFromElder } from "@/apis/elderAPI";
import SmartAreaView from "@/components/SmartAreaView";
import { useThemeContext } from "@/providers/ThemeProvider";
import { useQueryClient } from "@tanstack/react-query";
import { ElderTabParamList } from "./navigation/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<ElderTabParamList, "Settings">;
const SettingsPage = ({ navigation }: Props) => {
  const { role, logout, userId } = useAuthentication();
  const { toggleTheme, themeMode } = useThemeContext();
  const queryClient = useQueryClient();

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <List.Section>
          <Text variant="headlineLarge" style={styles.header}>
            Settings
          </Text>
          <List.Item
            title="Assign Caregiver"
            titleStyle={styles.title}
            left={() => <List.Icon icon="account-group" />}
            onPress={() => navigation.push("AssignCaregiver")}
            style={styles.item}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Remove Caregiver"
            titleStyle={styles.title}
            left={() => <List.Icon icon="account-remove" />}
            onPress={() => navigation.push("RemoveCaregiver")}
            style={styles.item}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Assign Arduino"
            titleStyle={styles.title}
            left={() => <List.Icon icon="bluetooth" />}
            onPress={() => navigation.push("ViewArduino")}
            style={styles.item}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Home Perimeter"
            titleStyle={styles.title}
            left={() => <List.Icon icon="home" />}
            onPress={() => navigation.push("MapElder")}
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
                  onPress: () => {
                    removeArduinoFromElder();
                    queryClient.invalidateQueries();
                  },
                },
              ]);
            }}
            style={styles.item}
          />

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
    fontWeight: "bold",
    marginBottom: 16,
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

export default SettingsPage;

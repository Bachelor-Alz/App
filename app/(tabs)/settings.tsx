import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { List, Divider, Switch } from "react-native-paper";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { router } from "expo-router";

const Settings = () => {
  const { role, logout } = useAuthentication();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <List.Section>
          <List.Subheader style={styles.header}>Settings</List.Subheader>

          {role === 1 && (
            <>
              <List.Item
                title="Assign Caregiver"
                titleStyle={styles.title}
                left={() => <List.Icon icon="account-group" />}
                onPress={() => router.push("/assigncaregiver")}
                style={styles.item}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Remove Caregiver"
                titleStyle={styles.title}
                left={() => <List.Icon icon="account-remove" />}
                onPress={() => router.push("/removecaregiver")}
                style={styles.item}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Assign Arduino"
                titleStyle={styles.title}
                left={() => <List.Icon icon="bluetooth" />}
                onPress={() => router.push("/viewarduino")}
                style={styles.item}
              />
            </>
          )}

          <Divider style={styles.divider} />

          <List.Item
            title="Dark Theme"
            titleStyle={styles.title}
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <Switch />}
            style={styles.item}
          />
          <Divider style={styles.divider} />

          <List.Item
            title="Edit Password"
            titleStyle={styles.title}
            left={() => <List.Icon icon="key" />}
            onPress={() => console.log("Navigate to Edit Password")}
            style={styles.item}
          />
          <Divider style={styles.divider} />

          <List.Item
            title="Delete Account"
            titleStyle={styles.title}
            left={() => <List.Icon icon="delete" />}
            onPress={() => console.log("Confirm Delete Account")}
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
    </SafeAreaView>
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

import React from "react";
import { View, SafeAreaView, StyleSheet, Alert } from "react-native";
import { List, Divider } from "react-native-paper";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { router } from "expo-router";
import { removeArduinoFromElder } from "@/apis/elderAPI";

const Settings = () => {
  const { role, logout, userEmail } = useAuthentication();

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
              <Divider style={styles.divider} />
              <List.Item
                title="Home Perimetor"
                titleStyle={styles.title}
                left={() => <List.Icon icon="home" />}
                onPress={() => router.push({ pathname: "/map_elder", params: { elderEmail: userEmail } })}
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

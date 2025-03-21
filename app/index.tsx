import React from "react";
import { PaperProvider } from "react-native-paper";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, useColorScheme } from "react-native";
import { createTheme } from "@/constants/CreateTheme";
import { router } from "expo-router";

const LoginScreen = () => {
  const colorScheme = useColorScheme();

  const theme = createTheme(colorScheme === "dark");

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.header, { color: theme.colors.text }]}>Login</Text>

          <TextInput
            style={[styles.input, { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text }]}
            placeholder="Email"
            placeholderTextColor={theme.dark ? "#bbb" : "#666"}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text }]}
            placeholder="Password"
            placeholderTextColor={theme.dark ? "#bbb" : "#666"}
            secureTextEntry
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.registerButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => router.push("/register")}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    padding: 25,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  registerButton: {
    marginTop: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default LoginScreen;

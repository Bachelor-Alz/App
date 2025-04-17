import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, Alert, TextInput, Button } from "react-native";
import { assignCaregiverToElder } from "@/apis/elderAPI";
import { useAuthentication } from "@/providers/AuthenticationProvider"; // Import the context

const AssignCaregiver = () => {
  const { userEmail } = useAuthentication();
  const [caregiverEmail, setCaregiverEmail] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  const handleAssign = async () => {
    if (!userEmail) {
      Alert.alert("Error", "No elder is logged in.");
      return;
    }

    if (!caregiverEmail.trim()) {
      Alert.alert("Input Error", "Please enter a caregiver email.");
      return;
    }

    setIsAssigning(true);
    try {
      await assignCaregiverToElder(userEmail, caregiverEmail);
      Alert.alert("Success", `Caregiver assigned to ${userEmail}`);
    } catch {
      Alert.alert("Error", "Failed to assign caregiver.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Assign Caregiver</Text>

      <TextInput
        placeholder="Enter Caregiver Email"
        value={caregiverEmail}
        onChangeText={setCaregiverEmail}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <Button title="Assign Caregiver" onPress={handleAssign} disabled={isAssigning} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default AssignCaregiver;

import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, useTheme, List, IconButton } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import { useToast } from "@/providers/ToastProvider";
import { useCaregiversForElder } from "@/hooks/useElders";
import { removeCaregiverFromElder } from "@/apis/elderAPI";

const RemoveCaregiver = () => {
  const theme = useTheme();
  const { addToast } = useToast();
  const { data: caregivers, isLoading, error } = useCaregiversForElder();

  if (isLoading) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>Loading...</Text>
        </View>
      </SmartAreaView>
    );
  }

  if (error || !caregivers || caregivers.length === 0) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>
            {error ? "Failed to find caregivers." : "No caregivers found."}
          </Text>
        </View>
      </SmartAreaView>
    );
  }

  const renderItem = ({ item }: { item: { name: string; email: string } }) => (
    <List.Item
      title={item.name}
      description={item.email}
      left={(props) => <List.Icon {...props} icon="account" />}
      style={[styles.listItem, { borderBottomColor: theme.colors.outline }]}
      right={() => (
        <IconButton
          icon="delete"
          mode="outlined"
          onPress={async () => {
            try {
              await removeCaregiverFromElder();
              if (router.canGoBack()) {
                router.back();
              }
            } catch (err) {
              addToast("Error", "Failed to remove caregiver.");
            }
          }}
          style={{ alignSelf: "center" }}
        />
      )}
    />
  );

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Remove Caregiver</Text>
        </View>
        <FlatList
          data={caregivers}
          renderItem={renderItem}
          keyExtractor={(item) => item.email.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </SmartAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  listItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  centeredText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default RemoveCaregiver;

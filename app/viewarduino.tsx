import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, useTheme, List } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import { useArduino } from "@/hooks/useElders";

const ViewArduino = () => {
  const theme = useTheme();
  const { data: arduino, isLoading, error } = useArduino();

  if (isLoading) {
    return <Text style={styles.centeredText}>Loading...</Text>;
  }

  if (error || !arduino || arduino.length === 0) {
    return <Text style={styles.centeredText}>{error ? "Failed to find Arduino." : "No Arduino found."}</Text>;
  }
  const renderItem = ({
    item,
  }: {
    item: { id: number; address: string; distance: number; lastActivity: number; macAddress: string };
  }) => (
    <List.Item
      title={item.macAddress}
      description={`Address: ${item.address}\nDistance: ${Math.round(item.distance * 1000)}m`}
      descriptionNumberOfLines={3}
      left={(props) => <List.Icon {...props} icon="bluetooth" />}
      style={[styles.listItem, { borderBottomColor: theme.colors.outline }]}
    />
  );

  return (
    <SmartAreaView>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <FlatList
          data={arduino}
          renderItem={renderItem}
          keyExtractor={(item) => item.macAddress || item.id.toString()}
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

export default ViewArduino;

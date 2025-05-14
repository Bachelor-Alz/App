import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, useTheme, List, Button } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import { useArduino } from "@/hooks/useElders";
import { assignArduinoToElder } from "@/apis/elderAPI";
import { useToast } from "@/providers/ToastProvider";

const ViewArduino = () => {
  const theme = useTheme();
  const { data: arduino, isLoading, error, refetch } = useArduino();
  const { addToast } = useToast();

  if (isLoading) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>Loading...</Text>
        </View>
      </SmartAreaView>
    );
  }

  if (error || !arduino || arduino.length === 0) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>{error ? "Failed to find Arduino." : "No Arduino found."}</Text>
        </View>
      </SmartAreaView>
    );
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
      right={() => (
        <Button
          mode="contained"
          onPress={async () => {
            try {
              await assignArduinoToElder(item.macAddress);
              await refetch();
            } catch (err) {
              addToast("Error", "Failed to assign Arduino.");
            }
          }}
          compact
          style={{ alignSelf: "center" }}>
          Assign
        </Button>
      )}
    />
  );

  return (
    <SmartAreaView>
      <View style={styles.container}>
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

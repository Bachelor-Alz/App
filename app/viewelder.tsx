import React, { useState } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { Text, List, Searchbar, useTheme, IconButton } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import { useEldersForCaregiver } from "@/hooks/useElders";
import { router } from "expo-router";
import { removeElderFromCaregiver } from "@/apis/elderAPI";
import { useToast } from "@/providers/ToastProvider";

const ViewElders = () => {
  const theme = useTheme();
  const { data: elders, isLoading, error, refetch } = useEldersForCaregiver();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addToast } = useToast();

  const filteredElders =
    elders?.filter((elder) => elder.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  const handleElderPress = (elder: { name: string; email: string; role: number }) => {
    router.push({
      pathname: "/(tabs)",
      params: {
        name: elder.name,
        email: elder.email,
        role: elder.role,
      },
    });
  };

  if (isLoading) {
    return (
      <SmartAreaView>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.centeredText}>Loading...</Text>
        </View>
      </SmartAreaView>
    );
  }

  if (error || !elders || elders.length === 0) {
    return (
      <SmartAreaView>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.centeredText}>{error ? "Failed to load elders." : "No elders found."}</Text>
        </View>
      </SmartAreaView>
    );
  }

  const renderItem = ({ item }: { item: { name: string; email: string; role: number } }) => (
    <TouchableOpacity onPress={() => handleElderPress(item)}>
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
                await removeElderFromCaregiver(item.email);
                await refetch();
              } catch (err) {
                addToast("Error while removing elders.", "The elder could not be removed.");
              }
            }}
            style={{ alignSelf: "center" }}
          />
        )}
      />
    </TouchableOpacity>
  );

  return (
    <SmartAreaView>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Searchbar
          placeholder="Search Elders"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { backgroundColor: theme.colors.surface }]}
        />

        <FlatList
          data={filteredElders}
          renderItem={renderItem}
          keyExtractor={(item) => item.email}
          contentContainerStyle={styles.flatListContainer}
          refreshing={isLoading}
          onRefresh={refetch}
          ListEmptyComponent={
            <Text style={[styles.centeredText, { color: theme.colors.onSurface }]}>
              No elders match your search.
            </Text>
          }
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
  searchbar: {
    marginBottom: 20,
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

export default ViewElders;

import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { List, Searchbar, useTheme } from "react-native-paper";
import { useEldersForCaregiver } from "@/hooks/useElders";
import { router } from "expo-router";

const ViewElders = () => {
  const theme = useTheme();
  const { data: elders, isLoading, error, refetch } = useEldersForCaregiver();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredElders =
    elders?.filter((elder) => elder.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  const handleElderPress = (elder: { name: string; email: string }) => {
    router.push({
      pathname: "/(tabs)",
      params: {
        name: elder.name,
        email: elder.email,
      },
    });
  };

  const renderItem = ({ item }: { item: { name: string; email: string } }) => (
    <TouchableOpacity onPress={() => handleElderPress(item)}>
      <List.Item
        title={item.name}
        description={item.email}
        left={(props) => <List.Icon {...props} icon="account" />}
        style={[styles.listItem, { borderBottomColor: theme.colors.outline }]}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search Elders"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchbar, { backgroundColor: theme.colors.surface }]}
      />

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : error ? (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>Failed to load elders.</Text>
        ) : filteredElders.length > 0 ? (
          <FlatList
            data={filteredElders}
            renderItem={renderItem}
            keyExtractor={(item) => item.email}
            contentContainerStyle={styles.flatListContainer}
            refreshing={isLoading}
            onRefresh={refetch}
          />
        ) : (
          <Text style={[styles.noEldersText, { color: theme.colors.onSurface }]}>No elders found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 10,
    alignItems: "center",
  },
  searchbar: {
    width: "90%",
    marginBottom: 20,
  },
  listContainer: {
    width: "90%",
    flex: 1,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  listItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  noEldersText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ViewElders;

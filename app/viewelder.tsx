import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Text, View, FlatList } from "react-native";
import { List, Searchbar, useTheme } from "react-native-paper";
import { fetchAllElders } from "@/apis/elderAPI";

type Elder = {
  name: string;
  email: string;
};

const ViewElders = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [elders, setElders] = useState<Elder[]>([]);

  useEffect(() => {
    fetchAllElders()
      .then((data) => {
        setElders(data);
      })
      .catch((error) => {
        console.error("Error fetching elders:", error);
      });
  }, []);

  const filteredElders = elders.filter((elder) =>
    elder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Elder }) => (
    <List.Item
      key={item.email}
      title={item.name}
      description={item.email}
      left={(props) => <List.Icon {...props} icon="account" />}
      style={[styles.listItem, { borderBottomColor: theme.colors.outline }]}
    />
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
        {filteredElders.length > 0 ? (
          <FlatList
            data={filteredElders}
            renderItem={renderItem}
            keyExtractor={(item) => item.email}
            contentContainerStyle={styles.flatListContainer}
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
});

export default ViewElders;

import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, View, FlatList, ActivityIndicator } from "react-native";
import { Button, List, Searchbar, useTheme } from "react-native-paper";
import { useCaregiverInvites } from "@/hooks/useElders";
import { acceptCaregiverInvite } from "@/apis/elderAPI";

const ViewCaregiverInvites = () => {
  const theme = useTheme();
  const { data: invites, isLoading, error, refetch } = useCaregiverInvites();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvites =
    invites?.filter((invite) => invite.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  const renderItem = ({ item }: { item: { name: string; email: string } }) => (
    <List.Item
      title={item.name}
      description={item.email}
      left={(props) => <List.Icon {...props} icon="account" />}
      right={() => (
        <Button
          mode="contained"
          onPress={async () => {
            try {
              await acceptCaregiverInvite(item.email);
              refetch();
            } catch (err) {
              console.error("Failed to accept invite:", err);
            }
          }}
          compact
          style={{ alignSelf: "center" }}>
          Accept
        </Button>
      )}
      style={[styles.listItem, { borderBottomColor: theme.colors.outline }]}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search Invites"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchbar, { backgroundColor: theme.colors.surface }]}
      />

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : error ? (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>Failed to load invites.</Text>
        ) : filteredInvites.length > 0 ? (
          <FlatList
            data={filteredInvites}
            renderItem={renderItem}
            keyExtractor={(item) => item.email}
            contentContainerStyle={styles.flatListContainer}
            refreshing={isLoading}
            onRefresh={refetch}
          />
        ) : (
          <Text style={[styles.noInvitesText, { color: theme.colors.onSurface }]}>
            No caregiver invites found
          </Text>
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
  noInvitesText: {
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

export default ViewCaregiverInvites;

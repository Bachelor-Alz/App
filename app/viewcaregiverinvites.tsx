import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { IconButton, List, Searchbar, Text, useTheme } from "react-native-paper";
import SmartAreaView from "@/components/SmartAreaView";
import { useCaregiverInvites } from "@/hooks/useElders";
import { acceptCaregiverInvite } from "@/apis/elderAPI";
import { useToast } from "@/providers/ToastProvider";

const ViewCaregiverInvites = () => {
  const theme = useTheme();
  const { data: invites, isLoading, error, refetch } = useCaregiverInvites();
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useToast();

  const filteredInvites =
    invites?.filter((invite) => invite.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  if (isLoading) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>Loading...</Text>
        </View>
      </SmartAreaView>
    );
  }

  if (error || !invites || invites.length === 0) {
    return (
      <SmartAreaView>
        <View style={styles.container}>
          <Text style={styles.centeredText}>{error ? "Failed to load invites." : "No invites found."}</Text>
        </View>
      </SmartAreaView>
    );
  }

  const renderItem = ({ item }: { item: { name: string; email: string } }) => (
    <List.Item
      title={item.name}
      description={item.email}
      left={(props) => <List.Icon {...props} icon="account" />}
      right={() => (
        <IconButton
          icon="check"
          mode="outlined"
          onPress={async () => {
            try {
              await acceptCaregiverInvite(item.email);
              await refetch();
            } catch (err) {
              addToast("Error accepting invite", "The invite could not be accepted.");
            }
          }}
          style={{ alignSelf: "center" }}
        />
      )}
      style={[styles.listItem, { borderBottomColor: theme.colors.outline }]}
    />
  );

  return (
    <SmartAreaView>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search Invites"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <FlatList
          data={filteredInvites}
          renderItem={renderItem}
          keyExtractor={(item) => item.email}
          contentContainerStyle={styles.flatListContainer}
          refreshing={isLoading}
          onRefresh={refetch}
          ListEmptyComponent={
            <Text style={[styles.centeredText, { color: theme.colors.onSurface }]}>
              No invites match your search.
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

export default ViewCaregiverInvites;

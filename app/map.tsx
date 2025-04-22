import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { IconButton } from "react-native-paper";
import useMap from "@/hooks/useMap";

const map = () => {
  const { mapRef, data, isLoading, isError, handleNextElder, handleZoom, fitToMarkers } = useMap();
  if (isLoading) {
    return <View style={styles.container}></View>;
  }
  if (isError) {
    return <View style={styles.container}></View>;
  }
  if (!data) {
    return <View style={styles.container}></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onMapReady={fitToMarkers}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {data.map((location) => (
          <Marker
            onPress={() => {
              console.log("Marker pressed", location.elderEmail);
            }}
            id={location.elderEmail}
            key={location.elderEmail}
            coordinate={{
              latitude: location.elderLatitude,
              longitude: location.elderLongitude,
            }}
            title={location.elderName}
            description={location.elderEmail}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <IconButton icon="magnify-plus-outline" mode="outlined" size={40} onPress={() => handleZoom(true)} />
        <IconButton
          icon="magnify-minus-outline"
          mode="outlined"
          size={40}
          onPress={() => handleZoom(false)}
        />
        <IconButton icon="refresh" mode="outlined" size={40} onPress={() => fitToMarkers()} />
        <IconButton icon={"arrow-right"} mode="outlined" size={40} onPress={() => handleNextElder()} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
});

export default map;

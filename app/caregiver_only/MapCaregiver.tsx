import { View, StyleSheet, Alert } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { IconButton, Text, useTheme } from "react-native-paper";
import useMap from "@/hooks/useMap";
import { Slider } from "@miblanchard/react-native-slider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CaregiverTabParamList } from "../navigation/navigation";

const formatDate = (date: string) => {
  return Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000) + " min ago";
};

type Props = NativeStackScreenProps<CaregiverTabParamList, "MapCaregiver">;
export default function MapCaregiver({ navigation }: Props) {
  const theme = useTheme();
  const {
    mapRef,
    markerRefs,
    data: elderLocations,
    isLoading,
    isError,
    homePerimeter,
    sliderValue,
    elderFocus,
    handleNextElder,
    handleZoom,
    fitToMarkers,
    showHomePerimeter,
    resetHomePerimeter,
    handleSlide,
  } = useMap();

  console.log("Elder Locations: ", elderLocations);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Error loading elder locations</Text>
      </View>
    );
  }

  if (!elderLocations || elderLocations.length === 0) {
    Alert.alert("No Elders Assigned", "Please assign elders to monitor before using the map.", [
      {
        text: "Go Back",
        onPress: () => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        },
      },
    ]);
    return null;
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} onMapReady={fitToMarkers}>
        {elderLocations.map((l) => (
          <Marker
            ref={(ref) => {
              if (ref && !markerRefs.current[l.userId]) {
                markerRefs.current[l.userId] = { current: ref };
              }
            }}
            id={l.email}
            key={l.email}
            onPress={() => (elderFocus.current = l.userId)}
            onCalloutPress={() => showHomePerimeter(l.userId)}
            coordinate={{
              latitude: l.latitude,
              longitude: l.longitude,
            }}
            title={l.name + " " + formatDate(l.lastUpdated)}
            description={l.email}
          />
        ))}
        {homePerimeter && (
          <>
            <Marker
              coordinate={{
                latitude: homePerimeter.homeLatitude,
                longitude: homePerimeter.homeLongitude,
              }}
              title={"Home Perimeter"}
              description={`Radius: ${homePerimeter.homeRadius} km`}
              pinColor="#1fb28a"
            />

            <Circle
              center={{
                latitude: homePerimeter.homeLatitude,
                longitude: homePerimeter.homeLongitude,
              }}
              radius={homePerimeter.homeRadius * 1000}
              strokeWidth={2}
              strokeColor="rgba(31, 178, 138, 0.8)"
              fillColor="rgba(31, 178, 138, 0.4)"
              zIndex={-1}
            />
          </>
        )}
      </MapView>
      {homePerimeter && (
        <>
          <Slider
            containerStyle={styles.slider}
            minimumValue={1}
            animateTransitions
            step={1}
            maximumValue={15}
            value={sliderValue}
            onValueChange={(value) => {
              if (elderFocus.current) {
                handleSlide(value[0], elderFocus.current);
              }
            }}
            thumbTintColor="#1fb28a"
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#1fb28a"
            renderAboveThumbComponent={() => (
              <View style={{ bottom: styles.slider.bottom + 50, alignItems: "center" }}>
                <Text style={{ color: "#1fb28a", fontSize: 20, fontWeight: "bold" }}>{sliderValue} km</Text>
              </View>
            )}
          />
          <IconButton
            icon={"close"}
            containerColor={theme.colors.background}
            mode="outlined"
            size={40}
            style={styles.hidePreimeterButton}
            onPress={() => {
              resetHomePerimeter();
              fitToMarkers();
            }}
          />
        </>
      )}

      <IconButton
        icon={"arrow-left"}
        mode="outlined"
        containerColor={theme.colors.background}
        size={40}
        style={styles.backButton}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

      <View style={styles.buttonContainer}>
        <IconButton
          icon="magnify-plus-outline"
          containerColor={theme.colors.background}
          mode="outlined"
          size={40}
          onPress={() => handleZoom(true)}
        />
        <IconButton
          icon="magnify-minus-outline"
          containerColor={theme.colors.background}
          mode="outlined"
          size={40}
          onPress={() => handleZoom(false)}
        />
        <IconButton
          icon="refresh"
          containerColor={theme.colors.background}
          mode="outlined"
          size={40}
          onPress={() => fitToMarkers()}
        />
        <IconButton
          icon={"arrow-right"}
          containerColor={theme.colors.background}
          mode="outlined"
          size={40}
          onPress={() => handleNextElder()}
        />
      </View>
    </View>
  );
}
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

    right: 0,
    flexDirection: "column",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  hidePreimeterButton: {
    position: "absolute",
    top: 35,
    right: 20,
  },
  backButton: {
    position: "absolute",
    top: 35,
    left: 20,
  },
  slider: {
    justifyContent: "center",
    position: "absolute",
    left: "8%",
    bottom: 100,
    width: "80%",
    height: 40,
  },
});

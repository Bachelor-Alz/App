import { View, StyleSheet } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { IconButton, Text, useTheme } from "react-native-paper";
import useMap from "@/hooks/useMap";
import { router } from "expo-router";
import { Slider } from "@miblanchard/react-native-slider";

const formatDate = (date: Date) => {
  return Math.floor((new Date().getTime() - date.getTime()) / 60000) + " min ago";
};

const map = () => {
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

  if (isLoading) {
    return <View style={styles.container}></View>;
  }
  if (isError) {
    return <View style={styles.container}></View>;
  }
  if (!elderLocations) {
    return <View style={styles.container}></View>;
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} onMapReady={fitToMarkers}>
        {elderLocations.map((l) => (
          <Marker
            ref={(ref) => {
              if (ref && !markerRefs.current[l.elderEmail]) {
                markerRefs.current[l.elderEmail] = { current: ref };
              }
            }}
            id={l.elderEmail}
            key={l.elderEmail}
            onPress={() => (elderFocus.current = l.elderEmail)}
            onCalloutPress={() => showHomePerimeter(l.elderEmail)}
            coordinate={{
              latitude: l.elderLatitude,
              longitude: l.elderLongitude,
            }}
            title={l.elderName + " " + formatDate(l.sent)}
            description={l.elderEmail}
          />
        ))}
        {homePerimeter && (
          <>
            <Marker
              coordinate={{
                latitude: homePerimeter.latitude,
                longitude: homePerimeter.longitude,
              }}
              title={"Home Perimeter"}
              description={`Radius: ${homePerimeter.radius} km`}
              pinColor="#1fb28a"
            />

            <Circle
              center={{
                latitude: homePerimeter.latitude,
                longitude: homePerimeter.longitude,
              }}
              radius={homePerimeter.radius * 1000}
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
            step={0.5}
            maximumValue={15}
            value={sliderValue}
            onValueChange={(value) => handleSlide(value[0])}
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
        onPress={() => router.back()}
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
    position: "absolute",
    left: "5%",
    bottom: 100,
    width: "90%",
    height: 40,
  },
});

export default map;

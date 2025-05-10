import { View, StyleSheet } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { IconButton, Text, useTheme, ActivityIndicator, Icon } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { Slider } from "@miblanchard/react-native-slider";

import useElderPerimeterMap from "@/hooks/useElderMap";

type LocalSearchParams = {
  elderEmail?: string;
};

const ElderPerimeterMap = () => {
  const theme = useTheme();
  const { elderEmail } = useLocalSearchParams<LocalSearchParams>();

  const { mapRef, isLoading, isError, homePerimeter, sliderValue, handleSlide, animateToHomeCoordinates } =
    useElderPerimeterMap(elderEmail || "");

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={{ marginTop: 10 }}>Loading perimeter data...</Text>
      </View>
    );
  }

  if (isError || !homePerimeter) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Could not load perimeter data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} onMapReady={() => animateToHomeCoordinates()}>
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
        {homePerimeter && (
          <Marker
            coordinate={{
              latitude: homePerimeter.homeLatitude,
              longitude: homePerimeter.homeLongitude,
            }}
            title="Home">
            <Icon source="home" size={30} />
          </Marker>
        )}
      </MapView>
      <Slider
        containerStyle={styles.slider}
        minimumValue={1}
        animateTransitions
        step={1}
        maximumValue={15}
        value={sliderValue}
        onValueChange={(value) => {
          if (typeof value === "number") {
            handleSlide(value);
          } else if (Array.isArray(value) && typeof value[0] === "number") {
            handleSlide(value[0]);
          }
        }}
        thumbTintColor="#1fb28a"
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#1fb28a"
        renderAboveThumbComponent={() => (
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#1fb28a", fontSize: 20, bottom: 120, fontWeight: "bold" }}>
              {sliderValue} km
            </Text>
          </View>
        )}
      />
      <View style={styles.zoomButtonContainer}>
        <IconButton
          icon="home"
          containerColor={theme.colors.background}
          mode="outlined"
          size={40}
          onPress={animateToHomeCoordinates}
        />
      </View>
      <IconButton
        icon={"arrow-left"}
        mode="outlined"
        containerColor={theme.colors.background}
        size={40}
        style={styles.backButton}
        onPress={() => router.back()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  map: {
    flex: 1,
  },
  slider: {
    position: "absolute",
    left: "8%",
    bottom: 80,
    width: "80%",
    height: 40,
    zIndex: 1,
  },
  zoomButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "column",
    alignItems: "flex-end",
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    top: 35,
    left: 20,
    zIndex: 1,
  },
});

export default ElderPerimeterMap;

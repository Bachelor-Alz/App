import { useQuery } from "@tanstack/react-query";
import { View, StyleSheet } from "react-native";
import MapView, { CalloutSubview, Marker } from "react-native-maps";
import { axiosInstance } from "@/apis/axiosConfig";
import { useRef, useState } from "react";
import { Button, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type elderLocations = {
  elderEmail: string;
  elderName: string;
  elderLatitude: number;
  elderLongitude: number;
};

const fetchElderLocations = async () => {
  const response = await axiosInstance.get<elderLocations[]>("Coordinates/Elders");
  return response.data;
};

const fetchElderLocationsFake = async () => {
  return [
    {
      elderEmail: "example@example.com",
      elderName: "John Doe",
      elderLatitude: 37.78825,
      elderLongitude: -122.4324,
    },
    {
      elderEmail: "newexample@example.com",
      elderName: "Jane Smith",
      elderLatitude: 38,
      elderLongitude: -122,
    },
  ];
};

const map = () => {
  const [zoomDelta, setZoomDelta] = useState({
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [elderFocus, setElderFocus] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const query = useQuery({
    queryKey: ["elderLocations"],
    queryFn: fetchElderLocationsFake,
    staleTime: 1000 * 60 * 5,
  });
  const { data, isLoading, isError } = query;
  if (isLoading) {
    return <View style={styles.container}></View>;
  }
  if (isError) {
    return <View style={styles.container}></View>;
  }
  if (!data) {
    return <View style={styles.container}></View>;
  }

  const handleNextElder = () => {
    if (elderFocus === null) {
      const firstElder = data[0];
      setElderFocus(firstElder.elderEmail);
      animateToElder(firstElder);
      return;
    }

    const currentIndex = data.findIndex((elder) => elder.elderEmail === elderFocus);
    const nextElder = data[(currentIndex + 1) % data.length];
    setElderFocus(nextElder.elderEmail);
    animateToElder(nextElder);
  };

  const animateToElder = (elder: elderLocations) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: elder.elderLatitude,
        longitude: elder.elderLongitude,
        latitudeDelta: zoomDelta.latitudeDelta,
        longitudeDelta: zoomDelta.longitudeDelta,
      });
    }
  };

  const handleZoom = (zoomIn: boolean) => {
    const zoomFactor = zoomIn ? 0.5 : 2.0; // zoomIn shrinks delta, zoomOut expands
    const newLatDelta = Math.max(0.001, zoomDelta.latitudeDelta * zoomFactor);
    const newLngDelta = Math.max(0.001, zoomDelta.longitudeDelta * zoomFactor);

    setZoomDelta({
      latitudeDelta: newLatDelta,
      longitudeDelta: newLngDelta,
    });

    mapRef.current?.getCamera().then((camera) => {
      mapRef.current?.animateToRegion({
        latitude: camera.center.latitude,
        longitude: camera.center.longitude,
        latitudeDelta: newLatDelta,
        longitudeDelta: newLngDelta,
      });
    });
  };

  const fitToMarkers = () => {
    const coordinates = data.map((location) => ({
      latitude: location.elderLatitude,
      longitude: location.elderLongitude,
    }));

    if (mapRef.current && coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

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

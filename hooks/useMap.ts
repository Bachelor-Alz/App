import { useQuery } from "@tanstack/react-query";
import MapView, { CalloutSubview, Marker } from "react-native-maps";
import { axiosInstance } from "@/apis/axiosConfig";
import { useRef, useState } from "react";

type elderLocations = {
  elderEmail: string;
  elderName: string;
  elderLatitude: number;
  elderLongitude: number;
};
//TODO USE WHEN WE GET DATA
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

const useMap = () => {
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

  const handleNextElder = () => {
    if (elderFocus === null) {
      if (data && data.length > 0) {
        const firstElder = data[0];
        setElderFocus(firstElder.elderEmail);
        animateToElder(firstElder);
      }
      return;
    }

    if (!data) return;
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
    if (!data) return;
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

  return {
    mapRef,
    data,
    isLoading,
    isError,
    handleNextElder,
    handleZoom,
    fitToMarkers,
  };
};

export default useMap;

import { useQuery, useQueryClient } from "@tanstack/react-query";
import MapView, { MapMarker } from "react-native-maps";
import { axiosInstance } from "@/apis/axiosConfig";
import { useRef, useState } from "react";
import { useToast } from "@/providers/ToastProvider";

type ElderLocations = {
  userId: string;
  email: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  perimeter: Perimeter;
};

type Perimeter = {
  homeLatitude: number;
  homeLongitude: number;
  homeRadius: number;
};
//TODO USE WHEN WE GET DATA
const fetchElderLocations = async () => {
  const response = await axiosInstance.get<ElderLocations[]>("/api/Health/Coordinates/Elders");
  if (response.status !== 200) {
    throw new Error("Failed to fetch elder locations");
  }
  return response.data;
};

const useMap = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [homePerimeter, setHomePerimeter] = useState<Perimeter | null>(null);
  const elderFocus = useRef<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<{ [key: string]: React.RefObject<MapMarker> }>({});
  const zoomDeltaRef = useRef({
    latitudeDelta: 1,
    longitudeDelta: 1,
  });
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["elderLocations"],
    queryFn: fetchElderLocations,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 5,
  });

  const { addToast } = useToast();

  const { data: elderLocations } = query;

  const handleNextElder = () => {
    if (!elderLocations) return;
    if (elderFocus.current === null && elderLocations.length > 0) {
      const firstElder = elderLocations[0];
      markerRefs.current[firstElder.email]?.current?.showCallout();
      elderFocus.current = firstElder.email;
      animateToElder(firstElder);
      return;
    }

    const currentIndex = elderLocations.findIndex((elder) => elder.email === elderFocus.current);
    const nextElder = elderLocations[(currentIndex + 1) % elderLocations.length];
    markerRefs.current[nextElder.email]?.current?.showCallout();
    elderFocus.current = nextElder.email;
    animateToElder(nextElder);
  };

  const animateToElder = (elder: ElderLocations) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: elder.latitude,
        longitude: elder.longitude,
        latitudeDelta: zoomDeltaRef.current.latitudeDelta / 30,
        longitudeDelta: zoomDeltaRef.current.longitudeDelta / 30,
      });
    }
  };

  const handleZoom = (zoomIn: boolean) => {
    const zoomFactor = zoomIn ? 0.5 : 1.5; // zoomIn shrinks delta, zoomOut expands
    const newLatDelta = Math.max(0.001, zoomDeltaRef.current.latitudeDelta * zoomFactor);
    const newLngDelta = Math.max(0.001, zoomDeltaRef.current.longitudeDelta * zoomFactor);

    zoomDeltaRef.current.latitudeDelta = newLatDelta;
    zoomDeltaRef.current.longitudeDelta = newLngDelta;

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
    if (!elderLocations) return;
    const coordinates = elderLocations.map((location) => ({
      latitude: location.latitude,
      longitude: location.longitude,
    }));

    if (mapRef.current && coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  };

  const showHomePerimeter = (userId: string) => {
    const elder = elderLocations?.find((location) => location.userId === userId);
    setSliderValue(elder?.perimeter.homeRadius || 0);
    if (elder && mapRef.current) {
      setHomePerimeter(() => ({
        homeLatitude: elder.perimeter.homeLatitude,
        homeLongitude: elder.perimeter.homeLongitude,
        homeRadius: elder.perimeter.homeRadius,
      }));

      mapRef.current.animateToRegion({
        latitude: elder.perimeter.homeLatitude,
        longitude: elder.perimeter.homeLongitude,
        latitudeDelta: elder.perimeter.homeRadius / 30,
        longitudeDelta: elder.perimeter.homeRadius / 30,
      });
    }
  };

  const handleSlide = async (value: number, elderEmail: string) => {
    if (!homePerimeter) return;
    setSliderValue(value);
    setHomePerimeter((prev) => ({
      ...prev!,
      homeRadius: value,
    }));

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: homePerimeter.homeLatitude,
          longitude: homePerimeter.homeLongitude,
          latitudeDelta: value / 25,
          longitudeDelta: value / 25,
        },
        0
      );
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updatePerimeter(value, elderFocus.current)
        .then(() => {
          queryClient.setQueryData<ElderLocations[] | undefined>(["elderLocations"], (oldData) => {
            if (!oldData) return oldData;
            return oldData.map((elder) =>
              elder.email === elderEmail
                ? { ...elder, perimeter: { ...elder.perimeter, homeRadius: value } }
                : elder
            );
          });
        })
        .catch((error) => {
          addToast("Error", error.message);
        });
    }, 2500);
  };

  const updatePerimeter = async (radius: number, elderId: string | null) => {
    if (!elderId || !radius) return;
    const response = await axiosInstance.post(`/api/Health/Perimeter`, undefined, {
      params: {
        radius: radius,
        elderId: elderId,
      },
    });
    if (response.status !== 200) {
      addToast("Error", "Failed to update perimeter");
    }
  };

  return {
    mapRef,
    markerRefs,
    ...query,
    homePerimeter,
    sliderValue,
    elderFocus,
    handleNextElder,
    handleZoom,
    fitToMarkers,
    showHomePerimeter,
    resetHomePerimeter: () => setHomePerimeter(null),
    handleSlide,
  };
};

export default useMap;

import { useQuery } from "@tanstack/react-query";
import MapView, { MapMarker, Marker } from "react-native-maps";
import { axiosInstance } from "@/apis/axiosConfig";
import { useRef, useState } from "react";

type elderLocations = {
  elderEmail: string;
  elderName: string;
  elderLatitude: number;
  elderLongitude: number;
  sent: Date;
  perimeter: Perimeter;
};

type Perimeter = {
  latitude: number;
  longitude: number;
  radius: number;
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
      sent: new Date(),
      perimeter: {
        latitude: 37.78825,
        longitude: -122.43,
        radius: 5,
      },
    },
    {
      elderEmail: "newexample@example.com",
      elderName: "Jane Smith",
      elderLatitude: 38,
      elderLongitude: -122,
      sent: new Date(),
      perimeter: {
        latitude: 38,
        longitude: -122.5,
        radius: 5,
      },
    },
  ];
};

const updatePerimeter = (value: number, email: string | null) => {
  if (!email || !value) return;
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

  const query = useQuery({
    queryKey: ["elderLocations"],
    queryFn: fetchElderLocationsFake,
    staleTime: 1000 * 60 * 5,
  });

  const { data: elderLocations } = query;

  const handleNextElder = () => {
    if (!elderLocations) return;
    if (elderFocus.current === null && elderLocations.length > 0) {
      const firstElder = elderLocations[0];
      markerRefs.current[firstElder.elderEmail]?.current?.showCallout();
      elderFocus.current = firstElder.elderEmail;
      animateToElder(firstElder);
      return;
    }

    const currentIndex = elderLocations.findIndex((elder) => elder.elderEmail === elderFocus.current);
    const nextElder = elderLocations[(currentIndex + 1) % elderLocations.length];
    markerRefs.current[nextElder.elderEmail]?.current?.showCallout();
    elderFocus.current = nextElder.elderEmail;
    animateToElder(nextElder);
  };

  const animateToElder = (elder: elderLocations) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: elder.elderLatitude,
        longitude: elder.elderLongitude,
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
      latitude: location.elderLatitude,
      longitude: location.elderLongitude,
    }));

    if (mapRef.current && coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  };

  const showHomePerimeter = (elderEmail: string) => {
    const elder = elderLocations?.find((location) => location.elderEmail === elderEmail);
    setSliderValue(elder?.perimeter.radius || 0);
    if (elder && mapRef.current) {
      setHomePerimeter(() => ({
        latitude: elder.perimeter.latitude,
        longitude: elder.perimeter.longitude,
        radius: elder.perimeter.radius,
      }));

      mapRef.current.animateToRegion({
        latitude: elder.perimeter.latitude,
        longitude: elder.perimeter.longitude,
        latitudeDelta: elder.perimeter.radius / 30,
        longitudeDelta: elder.perimeter.radius / 30,
      });
    }
  };

  const handleSlide = (value: number) => {
    if (!homePerimeter) return;
    setSliderValue(value);

    setHomePerimeter((prev) => ({
      ...prev!,
      radius: value,
    }));

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: homePerimeter.latitude,
          longitude: homePerimeter.longitude,
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
      updatePerimeter(value, elderFocus.current);
    }, 5000);
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

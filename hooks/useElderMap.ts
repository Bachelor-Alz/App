import { useQuery, useQueryClient } from "@tanstack/react-query";
import MapView from "react-native-maps";
import { axiosInstance } from "@/apis/axiosConfig";
import { useRef, useState } from "react";
import { useToast } from "@/providers/ToastProvider";

type Perimeter = {
  homeLatitude: number;
  homeLongitude: number;
  homeRadius: number;
};

const fetchElderPerimeter = async (): Promise<Perimeter | null> => {
  const response = await axiosInstance.get<Perimeter>("/api/Health/Coordinates");

  if (response.status !== 200) {
    throw new Error(`Failed to fetch perimeter data`);
  }

  return response.data;
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
    throw new Error("API call failed to update perimeter");
  }
};

const useElderPerimeterMap = (elderId: string) => {
  const [sliderValue, setSliderValue] = useState(1);
  const [homePerimeter, setHomePerimeter] = useState<Perimeter | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapView>(null);

  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const query = useQuery<Perimeter | null, Error>({
    queryKey: ["elderPerimeter", elderId],
    queryFn: () => fetchElderPerimeter(),
    enabled: !!elderId,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 5,
  });

  if (homePerimeter === null && query.data) {
    setHomePerimeter(query.data);
    setSliderValue(query.data.homeRadius);
  }

  const animateToHomeCoordinates = () => {
    if (!homePerimeter) return;
    mapRef.current?.animateToRegion({
      latitude: homePerimeter.homeLatitude,
      longitude: homePerimeter.homeLongitude,

      latitudeDelta: homePerimeter.homeRadius / 25,
      longitudeDelta: homePerimeter.homeRadius / 25,
    });
  };

  const handleSlide = async (value: number) => {
    if (!homePerimeter) return;
    const newRadius = Math.round(value);
    setSliderValue(newRadius);

    setHomePerimeter((prev) => (prev ? { ...prev, homeRadius: newRadius } : null));

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: homePerimeter.homeLatitude,
          longitude: homePerimeter.homeLongitude,
          latitudeDelta: newRadius / 25,
          longitudeDelta: newRadius / 25,
        },
        0
      );
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updatePerimeter(newRadius, elderId)
        .then(() => {
          queryClient.setQueryData<Perimeter | undefined>(["elderPerimeter", elderId], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              homeRadius: newRadius,
            };
          });
        })
        .catch((error) => {
          addToast("Error", error.message || "Failed to update perimeter.");
        });
    }, 2000);
  };

  return {
    ...query,
    mapRef,
    homePerimeter,
    sliderValue,
    handleSlide,
    animateToHomeCoordinates,
  };
};

export default useElderPerimeterMap;

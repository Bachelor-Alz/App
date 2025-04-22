import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/apis/axiosConfig";

type LocationResponse = {
  address: {
    city: string | undefined;
    road: string | undefined;
    house_number: string | undefined;
    country: string | undefined;
  };
  lon: number;
  lat: number;
};

const fetchLocation = async (address: string) => {
  const res = await axiosInstance
    .get<LocationResponse[]>(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${address}`
    )
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching location:", error);
      throw error;
    });

  return res
    .filter((item) => item.address?.city && item.address?.road && item.address?.house_number)
    .map((item) => ({
      fullAddress:
        `${item.address.city} ${item.address.road} ${item.address.house_number} ${item.address.country}`.trim(),
      lat: Number(item.lat),
      lon: Number(item.lon),
    }));
};

const useLocationResolver = (address: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["locationResolver", address],
    queryFn: () => fetchLocation(address!),
    staleTime: Infinity,
    retry: 2,
    enabled: Boolean(address) && enabled,
  });
};

export default useLocationResolver;

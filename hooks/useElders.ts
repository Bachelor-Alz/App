import { useQuery } from "@tanstack/react-query";
import {
  fetchEldersForCaregiver,
  fetchCaregiverInvites,
  fetchArduinos,
  fetchCaregiverForElder,
  Elder,
  Caregiver,
} from "@/apis/elderAPI";

export const useEldersForCaregiver = () => {
  return useQuery<Elder[]>({
    queryKey: ["eldersForCaregiver"],
    queryFn: fetchEldersForCaregiver,
    refetchOnMount: "always",
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCaregiverInvites = () => {
  return useQuery<Elder[]>({
    queryKey: ["caregiverInvites"],
    queryFn: fetchCaregiverInvites,
    refetchOnMount: "always",
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useArduino = () => {
  return useQuery<any[]>({
    queryKey: ["arduino"],
    queryFn: fetchArduinos,
    refetchOnMount: "always",
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCaregiversForElder = () => {
  return useQuery<Caregiver[]>({
    queryKey: ["caregiversForElder"],
    queryFn: () => fetchCaregiverForElder(),
    refetchOnMount: "always",
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useTestArduinoConnection = (elderId: string, queryFn: () => Promise<boolean>) => {
  return useQuery<boolean>({
    queryKey: ["testArduinoConnection", elderId],
    queryFn: () => queryFn(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

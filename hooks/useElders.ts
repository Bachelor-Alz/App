import { useQuery } from "@tanstack/react-query";
import {
  fetchAllElders,
  fetchEldersForCaregiver,
  fetchCaregiverInvites,
  fetchArduino,
  fetchCaregiverForElder,
} from "@/apis/elderAPI";

type Elder = {
  name: string;
  email: string;
  role: number;
};

type ElderInvite = {
  name: string;
  email: string;
};

type Caregiver = {
  name: string;
  email: string;
};

export const useElders = () => {
  return useQuery<Elder[]>({
    queryKey: ["elders"],
    queryFn: fetchAllElders,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useEldersForCaregiver = () => {
  return useQuery<Elder[]>({
    queryKey: ["eldersForCaregiver"],
    queryFn: fetchEldersForCaregiver,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCaregiverInvites = () => {
  return useQuery<ElderInvite[]>({
    queryKey: ["caregiverInvites"],
    queryFn: fetchCaregiverInvites,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useArduino = () => {
  return useQuery<any[]>({
    queryKey: ["arduino"],
    queryFn: fetchArduino,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCaregiversForElder = () => {
  return useQuery<Caregiver[]>({
    queryKey: ["caregiversForElder"],
    queryFn: () => fetchCaregiverForElder(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useTestArduinoConnection = (
  elderEmail: string,
  queryFn: (elderEmail: string) => Promise<boolean>
) => {
  return useQuery<boolean>({
    queryKey: ["testArduinoConnection", elderEmail],
    queryFn: () => queryFn(elderEmail),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

import { useQuery } from "@tanstack/react-query";
import { fetchAllElders, fetchEldersForCaregiver, fetchCaregiverInvites } from "@/apis/elderAPI";

type Elder = {
  name: string;
  email: string;
};

type ElderInvite = {
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

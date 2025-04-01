import { useQuery } from "@tanstack/react-query";
import {
  fetchHeartRate,
  fetchSPO2,
  fetchDistance,
  fetchSteps,
  HeartRateData,
  SPO2Data,
  DistanceData,
  StepsData,
} from "@/apis/healthAPI";

export const useHeartRate = (elderEmail: string, date: string, period: "Hour" | "Day" | "Week") => {
  return useQuery<HeartRateData[]>({
    queryKey: ["heartRate", elderEmail, date, period],
    queryFn: () => fetchHeartRate(elderEmail, date, period),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useSPO2 = (elderEmail: string, date: string, period: "Hour" | "Day" | "Week") => {
  return useQuery<SPO2Data[]>({
    queryKey: ["spo2", elderEmail, date, period],
    queryFn: () => fetchSPO2(elderEmail, date, period),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useDistance = (elderEmail: string, date: string, period: "Hour" | "Day" | "Week") => {
  return useQuery<DistanceData[]>({
    queryKey: ["distance", elderEmail, date, period],
    queryFn: () => fetchDistance(elderEmail, date, period),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useSteps = (elderEmail: string, date: string, period: "Hour" | "Day" | "Week") => {
  return useQuery<StepsData[]>({
    queryKey: ["steps", elderEmail, date, period],
    queryFn: () => fetchSteps(elderEmail, date, period),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

import { axiosInstance } from "./axiosConfig";
import { z } from "zod";

export const HeartRateDataSchema = z.object({
  maxrate: z.number(),
  minrate: z.number(),
  avgrate: z.number(),
  timestamp: z.string(),
});
export type HeartRateData = z.infer<typeof HeartRateDataSchema>;

export const SPO2DataSchema = z.object({
  avgSpO2: z.number(),
  maxSpO2: z.number(),
  minSpO2: z.number(),
  timestamp: z.string(),
});
export type SPO2Data = z.infer<typeof SPO2DataSchema>;

export const DistanceDataSchema = z.object({
  distance: z.number(),
  timestamp: z.string(),
});
export type DistanceData = z.infer<typeof DistanceDataSchema>;

export const StepsDataSchema = z.object({
  stepsCount: z.number(),
  timestamp: z.string(),
});
export type StepsData = z.infer<typeof StepsDataSchema>;

export const DashboardDataSchema = z.object({
  heartRate: z.number(),
  spO2: z.number(),
  steps: z.number(),
  distance: z.number(),
  fallCount: z.number(),
});
export type DashboardData = z.infer<typeof DashboardDataSchema>;

const emptyFallData = z.array(z.never());

export const FallDataSchema = z
  .object({
    timestamp: z.string(),
    fallCount: z.number(),
  })
  .or(emptyFallData);

export type FallData = z.infer<typeof FallDataSchema>;

export const fetchHeartRate = async (
  elderEmail: string,
  date: string,
  period: "Hour" | "Day" | "Week"
): Promise<HeartRateData[]> => {
  try {
    let response = await axiosInstance.get<HeartRateData[]>("/api/Health/Heartrate", {
      params: { elderEmail, date, period },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSPO2 = async (
  elderEmail: string,
  date: string,
  period: "Hour" | "Day" | "Week"
): Promise<SPO2Data[]> => {
  try {
    let response = await axiosInstance.get<SPO2Data[]>("/api/Health/SPO2", {
      params: { elderEmail, date, period },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDistance = async (
  elderEmail: string,
  date: string,
  period: "Hour" | "Day" | "Week"
): Promise<DistanceData[]> => {
  try {
    let response = await axiosInstance.get<DistanceData[]>("/api/Health/Distance", {
      params: { elderEmail, date, period },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSteps = async (
  elderEmail: string,
  date: string,
  period: "Hour" | "Day" | "Week"
): Promise<StepsData[]> => {
  return axiosInstance
    .get<StepsData[]>("/api/Health/Steps", {
      params: { elderEmail, date, period },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const fetchDashBoardData = async (elderEmail: string): Promise<DashboardData> => {
  try {
    let response = await axiosInstance.get<DashboardData>("/api/Health/Dashboard", {
      params: { elderEmail },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFallsData = async (
  elderEmail: string,
  date: string,
  period: "Hour" | "Day" | "Week"
): Promise<FallData[]> => {
  try {
    let response = await axiosInstance.get("/api/Health/Falls", {
      params: { elderEmail, date, period },
    });
    return await response.data;
  } catch (error) {
    throw error;
  }
};

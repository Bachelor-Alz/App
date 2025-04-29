import { axiosInstance } from "./axiosConfig";

export type HeartRateData = {
  id: number;
  maxrate: number;
  minrate: number;
  avgrate: number;
  timestamp: string;
};

export type SPO2Data = {
  id: number;
  avgSpO2: number;
  maxSpO2: number;
  minSpO2: number;
  timestamp: string;
};

export type DistanceData = {
  id: number;
  distance: number;
  timestamp: string;
};

export type StepsData = {
  id: number;
  stepsCount: number;
  timestamp: string;
};

export type DashboardData = {
  id: number;
  heartRate: number;
  spO2: number;
  steps: number;
  distance: number;
  allFall: number;
  locationAddress: string;
};

export type FallData = {
  id: number;
  timestamp: string;
  fallCount: number;
};

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

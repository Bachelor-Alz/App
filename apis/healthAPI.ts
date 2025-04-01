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
  spO2: number;
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

export const fetchHeartRate = (
  elderEmail: string,
  date: string,
  period: "Hour" | "Day" | "Week"
): Promise<HeartRateData[]> => {
  return axiosInstance
    .get<HeartRateData[]>("/api/Health/Heartrate", {
      params: { elderEmail, date, period },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching heart rate:", error);
      throw error;
    });
};

export const fetchSPO2 = (
  elderEmail: string,
  date: string,
  period: "Hour" | "Day" | "Week"
): Promise<SPO2Data[]> => {
  return axiosInstance
    .get<SPO2Data[]>("/api/Health/SPO2", {
      params: { elderEmail, date, period },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching SPO2:", error);
      throw error;
    });
};

export const fetchDistance = (
  elderEmail: string,
  date: string,
  period: "Hour" | "Day" | "Week"
): Promise<DistanceData[]> => {
  return axiosInstance
    .get<DistanceData[]>("/api/Health/Distance", {
      params: { elderEmail, date, period },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching distance:", error);
      throw error;
    });
};

export const fetchSteps = (
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
      console.error("Error fetching steps:", error);
      throw error;
    });
};

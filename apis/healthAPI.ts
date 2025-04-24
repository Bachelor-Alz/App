import { axiosInstance } from "./axiosConfig";

export type HeartRateData = {
  heartrate: {
    id: number;
    maxrate: number;
    minrate: number;
    avgrate: number;
    timestamp: string;
  };
  currentHeartRate: {
    timestamp: string;
    heartrate: number;
  };
};

export type SPO2Data = {
  spo2: {
    id: number;
    avgSpO2: number;
    maxSpO2: number;
    minSpO2: number;
    timestamp: string;
  };
  currentSpo2: {
    spO2: number;
    timestamp: string;
  };
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
    console.error("Error fetching heart rate:", error);
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
    console.error("Error fetching SPO2:", error);
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
    console.error("Error fetching distance:", error);
    throw error;
  }
};

export const fetchSteps = async (
  elderEmail: string,
  date: string,
  period: "Hour" | "Day" | "Week"
): Promise<StepsData[]> => {
  try {
    let response = await axiosInstance.get<StepsData[]>("/api/Health/Steps", {
      params: { elderEmail, date, period },
    });
    const data = response.data;
    return data.filter((step) => {
      const dateObj = new Date(step.timestamp);
      const currentDate = new Date(date);
      return (
        dateObj.getDate() === currentDate.getDate() &&
        dateObj.getMonth() === currentDate.getMonth() &&
        dateObj.getFullYear() === currentDate.getFullYear()
      );
    });
  } catch (error) {
    console.error("Error fetching steps:", error);
    throw error;
  }
};

export const fetchDashBoardData = async (elderEmail: string): Promise<DashboardData> => {
  try {
    let response = await axiosInstance.get<DashboardData>("/api/Health/Dashboard", {
      params: { elderEmail },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
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
    console.error("Error fetching falls data:", error);
    throw error;
  }
};

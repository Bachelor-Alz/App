import { setBearer, axiosInstance } from "@/apis/axiosConfig";
import { loginUserRequest } from "@/apis/loginAPI";
import {
  HeartRateDataSchema,
  SPO2DataSchema,
  DistanceDataSchema,
  StepsDataSchema,
  DashboardDataSchema,
  FallDataSchema,
  fetchDashBoardData,
  fetchDistance,
  fetchFallsData,
  fetchHeartRate,
  fetchSPO2,
  fetchSteps,
} from "@/apis/healthAPI";
import { LoginForm } from "@/app/auth/Login";

const mockUser: LoginForm = {
  email: "Test@Test.dk",
  password: "Test1234!",
};

const expectedEntryCounts = {
  Hour: 60 / 5,
  Day: 24,
  Week: 7,
} as const;

type TimeFrame = keyof typeof expectedEntryCounts;

const assertTimestampsInline = (entries: Required<{ timestamp: string }[]>, timeFrame: TimeFrame) => {
  switch (timeFrame) {
    case "Week":
      const daysSeen = new Set<number>();

      for (const { timestamp } of entries) {
        const date = new Date(timestamp);
        const day = date.getDay();
        expect(day).toBeGreaterThanOrEqual(0);
        expect(day).toBeLessThan(7);
        daysSeen.add(day);
      }

      expect(daysSeen.size).toBe(7);
      break;

    case "Hour": {
      const minutesSeen = new Set<number>();

      for (const { timestamp } of entries) {
        const date = new Date(timestamp);
        const minutes = date.getMinutes();
        expect(minutes % 5).toBe(0);
        expect(minutes).toBeGreaterThanOrEqual(0);
        expect(minutes).toBeLessThan(60);
        minutesSeen.add(minutes);
      }

      expect(minutesSeen.size).toBe(12);
      break;
    }

    case "Day": {
      const hoursSeen = new Set<number>();

      for (const { timestamp } of entries) {
        const date = new Date(timestamp);
        const hour = date.getHours();
        expect(hour).toBeGreaterThanOrEqual(0);
        expect(hour).toBeLessThan(24);
        hoursSeen.add(hour);
      }

      expect(hoursSeen.size).toBe(24);
      break;
    }
  }
};

beforeAll(async () => {
  const url =
    process.env.EXPO_PUBLIC_API_URL && process.env.EXPO_PUBLIC_API_PORT
      ? `${process.env.EXPO_PUBLIC_API_URL}:${process.env.EXPO_PUBLIC_API_PORT}`
      : "http://localhost:5171";

  console.log("Connecting to backend at", url);
  axiosInstance.defaults.baseURL = url;
  try {
    const response = await loginUserRequest(mockUser);
    setBearer(response.token);
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login failed, cannot run tests: " + (error as any)?.message);
  }
});

describe("Backend Integration Tests type correctness", () => {
  const timeFrames = Object.keys(expectedEntryCounts) as TimeFrame[];
  const nowString = new Date().toISOString();

  test.each(timeFrames)("should fetch heart rate data by %s", async (timeFrame) => {
    const hrData = await fetchHeartRate(mockUser.email, nowString, timeFrame);
    expect(hrData).toHaveLength(expectedEntryCounts[timeFrame]);
    hrData.forEach((entry) => HeartRateDataSchema.parse(entry));
    assertTimestampsInline(hrData, timeFrame);
  });

  test.each(timeFrames)("should fetch SPO2 data by %s", async (timeFrame) => {
    const spo2Data = await fetchSPO2(mockUser.email, nowString, timeFrame);
    expect(spo2Data).toHaveLength(expectedEntryCounts[timeFrame]);
    spo2Data.forEach((entry) => SPO2DataSchema.parse(entry));
    assertTimestampsInline(spo2Data, timeFrame);
  });

  test.each(timeFrames)("should fetch distance data by %s", async (timeFrame) => {
    const distanceData = await fetchDistance(mockUser.email, nowString, timeFrame);
    expect(distanceData).toHaveLength(expectedEntryCounts[timeFrame]);
    distanceData.forEach((entry) => DistanceDataSchema.parse(entry));
    assertTimestampsInline(distanceData, timeFrame);
  });

  test.each(timeFrames)("should fetch steps data by %s", async (timeFrame) => {
    const stepsData = await fetchSteps(mockUser.email, nowString, timeFrame);
    expect(stepsData).toHaveLength(expectedEntryCounts[timeFrame]);
    stepsData.forEach((entry) => StepsDataSchema.parse(entry));
    assertTimestampsInline(stepsData, timeFrame);
  });

  test.each(timeFrames)("should fetch falls data by %s", async (timeFrame) => {
    const fallsData = await fetchFallsData(mockUser.email, new Date().toISOString(), timeFrame);
    if (fallsData.length > 0) {
      const firstNonEmpty = fallsData.find(
        (data) => data !== null && data !== undefined && Object.keys(data).length > 0
      );
      FallDataSchema.parse(firstNonEmpty);
      expect(firstNonEmpty).toBeDefined();
    } else {
      if (fallsData.length === 0) {
        expect(fallsData).toHaveLength(0);
      } else {
        expect(fallsData).toBeNull();
      }
    }
  });

  test("should fetch dashboard data", async () => {
    const dashboardData = await fetchDashBoardData(mockUser.email);
    DashboardDataSchema.parse(dashboardData);
  });
});

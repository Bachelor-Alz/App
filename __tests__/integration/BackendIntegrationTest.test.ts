import { setBearer, axiosInstance } from "@/apis/axiosConfig";
import { loginUserRequest } from "@/apis/loginAPI";
import { LoginForm } from "@/app";
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

const assertTimestampsInline = (
  entries: Required<{ timestamp: string }[]>,
  timeFrame: TimeFrame,
  referenceDate: Date
) => {
  const refDateStr = referenceDate.toDateString();

  switch (timeFrame) {
    case "Week":
      return;

    case "Hour": {
      const minutesSeen = new Set<number>();

      for (const { timestamp } of entries) {
        const date = new Date(timestamp);
        const minutes = date.getMinutes();

        expect(date.toDateString()).toBe(refDateStr);
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

        expect(date.toDateString()).toBe(refDateStr);
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
  axiosInstance.defaults.baseURL = `http://localhost:5171`;
  try {
    const response = await loginUserRequest(mockUser);
    setBearer(response.token);
  } catch (error) {
    console.error("Login failed:", error);
  }
});

describe("Backend Integration Tests type correctness", () => {
  const timeFrames = Object.keys(expectedEntryCounts) as TimeFrame[];
  const nowString = new Date().toISOString();

  test.each(timeFrames)("should fetch heart rate data by %s", async (timeFrame) => {
    const hrData = await fetchHeartRate(mockUser.email, nowString, timeFrame);
    expect(hrData).toHaveLength(expectedEntryCounts[timeFrame]);
    hrData.forEach((entry) => HeartRateDataSchema.parse(entry));
  });

  test.each(timeFrames)("should fetch SPO2 data by %s", async (timeFrame) => {
    const spo2Data = await fetchSPO2(mockUser.email, nowString, timeFrame);
    expect(spo2Data).toHaveLength(expectedEntryCounts[timeFrame]);
    spo2Data.forEach((entry) => SPO2DataSchema.parse(entry));
    assertTimestampsInline(spo2Data, timeFrame, new Date(nowString));
  });

  test.each(timeFrames)("should fetch distance data by %s", async (timeFrame) => {
    const distanceData = await fetchDistance(mockUser.email, nowString, timeFrame);
    expect(distanceData).toHaveLength(expectedEntryCounts[timeFrame]);
    distanceData.forEach((entry) => DistanceDataSchema.parse(entry));
  });

  test.each(timeFrames)("should fetch steps data by %s", async (timeFrame) => {
    const stepsData = await fetchSteps(mockUser.email, nowString, timeFrame);
    expect(stepsData).toHaveLength(expectedEntryCounts[timeFrame]);
    stepsData.forEach((entry) => StepsDataSchema.parse(entry));
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
      expect(fallsData).toHaveLength(0);
    }
  });

  test("should fetch dashboard data", async () => {
    const dashboardData = await fetchDashBoardData(mockUser.email);
    DashboardDataSchema.parse(dashboardData);
  });
});

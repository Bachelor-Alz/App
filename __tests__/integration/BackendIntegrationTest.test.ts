// This test suite might fail if .env file is not correctly loaded.
// Its only supposed to be run in CI/CD pipeline or by specifically setting the environment variables.
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

beforeAll(async () => {
  axiosInstance.defaults.baseURL = `${process.env.EXPO_PUBLIC_API_URL}:${process.env.EXPO_PUBLIC_API_PORT}`;
  try {
    const response = await loginUserRequest(mockUser);
    setBearer(response.token);
  } catch (error) {
    console.error("Login failed:", error);
  }
});

describe("Backend Integration Tests type correctness", () => {
  const timeFrames = Object.keys(expectedEntryCounts) as TimeFrame[];
  const yesterDay = new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();

  test.each(timeFrames)("should fetch heart rate data by %s", async (timeFrame) => {
    const hrData = await fetchHeartRate(mockUser.email, yesterDay, timeFrame);
    expect(hrData).toHaveLength(expectedEntryCounts[timeFrame]);
    hrData.forEach((entry) => HeartRateDataSchema.parse(entry));
  });

  test.each(timeFrames)("should fetch SPO2 data by %s", async (timeFrame) => {
    const spo2Data = await fetchSPO2(mockUser.email, yesterDay, timeFrame);
    expect(spo2Data).toHaveLength(expectedEntryCounts[timeFrame]);
    spo2Data.forEach((entry) => SPO2DataSchema.parse(entry));
  });

  test.each(timeFrames)("should fetch distance data by %s", async (timeFrame) => {
    const distanceData = await fetchDistance(mockUser.email, yesterDay, timeFrame);
    expect(distanceData).toHaveLength(expectedEntryCounts[timeFrame]);
    distanceData.forEach((entry) => DistanceDataSchema.parse(entry));
  });

  test.each(timeFrames)("should fetch steps data by %s", async (timeFrame) => {
    const stepsData = await fetchSteps(mockUser.email, yesterDay, timeFrame);
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

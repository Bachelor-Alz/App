import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { fetchHeartRate, fetchSPO2, fetchDistance, fetchSteps, fetchFallsData } from "@/apis/healthAPI";
import useGetVisualizationData from "@/hooks/useGetVisualizationData";
import { ToastProvider } from "@/providers/ToastProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
      gcTime: Infinity,
    },
    mutations: {
      retry: false,
      gcTime: Infinity,
    },
  },
});

const testEmail = "test@example.com";
const testDate = "2025-04-01T10:00:00.000Z";
const period: "Day" = "Day";

jest.mock("@/apis/healthAPI", () => ({
  fetchHeartRate: jest.fn(),
  fetchSPO2: jest.fn(),
  fetchDistance: jest.fn(),
  fetchSteps: jest.fn(),
  fetchFallsData: jest.fn(),
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ToastProvider>
);

beforeAll(() => {
  const fixedDate = new Date("2025-04-01T10:00:00.000Z");
  jest.useFakeTimers().setSystemTime(fixedDate);
});

describe("useGetVisualizationData hook", () => {
  afterAll(() => {
    jest.useRealTimers();
  });

  it("should fetch heart rate data correctly for a given elder and time range", async () => {
    const mockHeartRateData = [
      {
        heartrate: {
          id: 1,
          maxrate: 120,
          minrate: 80,
          avgrate: 100,
          timestamp: "2025-04-01T00:00:00Z",
        },
        currentHeartRate: {
          timestamp: "2025-04-01T00:00:00Z",
          heartrate: 100,
        },
      },
    ];

    (fetchHeartRate as jest.Mock).mockResolvedValue(mockHeartRateData);

    const { result } = renderHook(
      () =>
        useGetVisualizationData({
          userId: testEmail,
          fetchFn: fetchHeartRate,
          metricKey: "heartRate",
          prefetch: true,
          initialDate: new Date(testDate),
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual(mockHeartRateData));
    expect(fetchHeartRate).toHaveBeenCalledWith(testEmail, testDate, period);
  });

  it("should fetch SPO2 data correctly for a given elder and time range", async () => {
    const mockSPO2Data = [
      {
        spo2: {
          id: 1,
          avgSpO2: 98,
          maxSpO2: 100,
          minSpO2: 96,
          timestamp: "2025-04-01T00:00:00Z",
        },
        currentSpo2: {
          spO2: 98,
          timestamp: "2025-04-01T00:00:00Z",
        },
      },
    ];

    (fetchSPO2 as jest.Mock).mockResolvedValue(mockSPO2Data);

    const { result } = renderHook(
      () =>
        useGetVisualizationData({
          userId: testEmail,
          fetchFn: fetchSPO2,
          metricKey: "spo2",
          prefetch: true,
          initialDate: new Date(testDate),
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual(mockSPO2Data));
    expect(fetchSPO2).toHaveBeenCalledWith(testEmail, testDate, period);
  });

  it("should fetch distance data correctly for a given elder and time range", async () => {
    const mockDistanceData = [{ id: 1, distance: 5.2, timestamp: "2025-04-01T14:00:00Z" }];

    (fetchDistance as jest.Mock).mockResolvedValue(mockDistanceData);

    const { result } = renderHook(
      () =>
        useGetVisualizationData({
          userId: testEmail,
          fetchFn: fetchDistance,
          metricKey: "distance",
          prefetch: true,
          initialDate: new Date(testDate),
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual(mockDistanceData));
    expect(fetchDistance).toHaveBeenCalledWith(testEmail, testDate, period);
  });

  it("should fetch steps data correctly for a given elder and time range", async () => {
    const mockStepsData = [{ id: 1, stepsCount: 1200, timestamp: "2025-04-01T14:00:00Z" }];

    (fetchSteps as jest.Mock).mockResolvedValue(mockStepsData);

    const { result } = renderHook(
      () =>
        useGetVisualizationData({
          userId: testEmail,
          fetchFn: fetchSteps,
          metricKey: "steps",
          prefetch: true,
          initialDate: new Date(testDate),
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual(mockStepsData));
    expect(fetchSteps).toHaveBeenCalledWith(testEmail, testDate, period);
  });

  it("should fetch falls data correctly for a given elder and time range", async () => {
    const mockFallsData = [{ id: 1, timestamp: "2025-04-01T14:00:00Z", fallCount: 2 }];

    (fetchFallsData as jest.Mock).mockResolvedValue(mockFallsData);

    const { result } = renderHook(
      () =>
        useGetVisualizationData({
          userId: testEmail,
          fetchFn: fetchFallsData,
          metricKey: "falls",
          prefetch: true,
          initialDate: new Date(testDate),
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual(mockFallsData));
    expect(fetchFallsData).toHaveBeenCalledWith(testEmail, testDate, period);
  });

  it("should handle the navigation of time range", async () => {
    const { result } = renderHook(
      () =>
        useGetVisualizationData({
          userId: testEmail,
          fetchFn: fetchHeartRate,
          metricKey: "heartRate",
          prefetch: true,
          initialDate: new Date(testDate),
        }),
      {
        wrapper,
      }
    );

    expect(result.current.timeRange).toBe("Day");

    act(() => {
      result.current.setTimeRange("Hour");
    });

    expect(result.current.timeRange).toBe("Hour");
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { fetchHeartRate, fetchSPO2, fetchDistance, fetchSteps, fetchFallsData } from "@/apis/healthAPI";
import useGetVisualizationData from "@/hooks/useGetVisualizationData";

jest.mock("@/apis/healthAPI");

const testEmail = "test@example.com";
const testDate = "2025-04-01T10:00:00.000Z";
const period: "Day" = "Day";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

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

    const testDate = new Date("2025-04-01T10:00:00.000Z");

    const { result } = renderHook(
      () => useGetVisualizationData(testEmail, fetchHeartRate, "heartRate", false, testDate),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess);
    expect(fetchHeartRate).toHaveBeenCalledWith(testEmail, testDate.toISOString(), period);
    expect(result.current.data).toEqual(mockHeartRateData);
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

    const { result } = renderHook(() => useGetVisualizationData(testEmail, fetchSPO2, "spo2"), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(fetchSPO2).toHaveBeenCalledWith(testEmail, testDate, period);
    expect(result.current.data).toEqual(mockSPO2Data);
  });

  it("should fetch distance data correctly for a given elder and time range", async () => {
    const mockDistanceData = [{ id: 1, distance: 5.2, timestamp: "2025-04-01T14:00:00Z" }];

    (fetchDistance as jest.Mock).mockResolvedValue(mockDistanceData);

    const { result } = renderHook(() => useGetVisualizationData(testEmail, fetchDistance, "distance"), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(fetchDistance).toHaveBeenCalledWith(testEmail, testDate, period);
    expect(result.current.data).toEqual(mockDistanceData);
  });

  it("should fetch steps data correctly for a given elder and time range", async () => {
    const mockStepsData = [{ id: 1, stepsCount: 1200, timestamp: "2025-04-01T14:00:00Z" }];

    (fetchSteps as jest.Mock).mockResolvedValue(mockStepsData);

    const { result } = renderHook(() => useGetVisualizationData(testEmail, fetchSteps, "steps"), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(fetchSteps).toHaveBeenCalledWith(testEmail, testDate, period);
    expect(result.current.data).toEqual(mockStepsData);
  });

  it("should fetch falls data correctly for a given elder and time range", async () => {
    const mockFallsData = [{ id: 1, timestamp: "2025-04-01T14:00:00Z", fallCount: 2 }];

    (fetchFallsData as jest.Mock).mockResolvedValue(mockFallsData);

    const { result } = renderHook(() => useGetVisualizationData(testEmail, fetchFallsData, "falls"), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(fetchFallsData).toHaveBeenCalledWith(testEmail, testDate, period);
    expect(result.current.data).toEqual(mockFallsData);
  });

  it("should handle the navigation of time range", async () => {
    const { result } = renderHook(() => useGetVisualizationData(testEmail, fetchHeartRate, "heartRate"), {
      wrapper,
    });

    expect(result.current.timeRange).toBe("Day");

    act(() => {
      result.current.setTimeRange("Hour");
    });

    expect(result.current.timeRange).toBe("Hour");
  });
});

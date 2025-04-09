import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchHeartRate, fetchSPO2, fetchDistance, fetchSteps } from "@/apis/healthAPI";
import { useHeartRate, useSPO2, useDistance, useSteps } from "@/hooks/useHealth";

jest.mock("@/apis/healthAPI");

const testEmail = "test@example.com";
const testDate = "2025-04-01T14:00:00";
const period: "Hour" = "Hour";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe("useHealth hooks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch heart rate data successfully", async () => {
    const mockData = [
      { id: 1, maxrate: 120, minrate: 60, avgrate: 90, timestamp: "2025-04-01T08:39:26.839Z" },
    ];
    (fetchHeartRate as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useHeartRate(testEmail, testDate, period), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(fetchHeartRate).toHaveBeenCalledWith(testEmail, testDate, period);
  });

  it("should fetch SPO2 data successfully", async () => {
    const mockData = [{ id: 1, spO2: 98, maxSpO2: 100, minSpO2: 96, timestamp: "2025-04-01T08:39:44.704Z" }];
    (fetchSPO2 as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useSPO2(testEmail, testDate, period), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(fetchSPO2).toHaveBeenCalledWith(testEmail, testDate, period);
  });

  it("should fetch distance data successfully", async () => {
    const mockData = [{ id: 1, distance: 5.2, timestamp: "2025-04-01T08:39:55.325Z" }];
    (fetchDistance as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useDistance(testEmail, testDate, period), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(fetchDistance).toHaveBeenCalledWith(testEmail, testDate, period);
  });

  it("should fetch steps data successfully", async () => {
    const mockData = [{ id: 1, stepsCount: 1000, timestamp: "2025-04-01T08:40:05.296Z" }];
    (fetchSteps as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useSteps(testEmail, testDate, period), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(fetchSteps).toHaveBeenCalledWith(testEmail, testDate, period);
  });

  it("should handle heart rate API failure", async () => {
    (fetchHeartRate as jest.Mock).mockRejectedValue(new Error("Failed to fetch heart rate"));

    const { result } = renderHook(() => useHeartRate(testEmail, testDate, period), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });
    expect(result.current.error?.message).toBe("Failed to fetch heart rate");
  });

  it("should handle SPO2 API failure", async () => {
    (fetchSPO2 as jest.Mock).mockRejectedValue(new Error("Failed to fetch SPO2"));

    const { result } = renderHook(() => useSPO2(testEmail, testDate, period), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });
    expect(result.current.error?.message).toBe("Failed to fetch SPO2");
  });

  it("should handle distance API failure", async () => {
    (fetchDistance as jest.Mock).mockRejectedValue(new Error("Failed to fetch distance"));

    const { result } = renderHook(() => useDistance(testEmail, testDate, period), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });
    expect(result.current.error?.message).toBe("Failed to fetch distance");
  });

  it("should handle steps API failure", async () => {
    (fetchSteps as jest.Mock).mockRejectedValue(new Error("Failed to fetch steps"));

    const { result } = renderHook(() => useSteps(testEmail, testDate, period), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });
    expect(result.current.error?.message).toBe("Failed to fetch steps");
  });

  it("should handle empty heart rate response", async () => {
    (fetchHeartRate as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useHeartRate(testEmail, testDate, period), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("should be in loading state initially for SPO2", async () => {
    (fetchSPO2 as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useSPO2(testEmail, testDate, period), { wrapper });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

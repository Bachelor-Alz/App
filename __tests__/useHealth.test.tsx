import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchHeartRate, fetchSPO2, fetchDistance, fetchSteps } from "@/apis/healthAPI";
import { useHeartRate, useSPO2, useDistance, useSteps } from "@/hooks/useHealth";

jest.mock("@/apis/healthAPI");

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

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe("useHealth hooks", () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("should fetch heart rate data successfully", async () => {
    const mockData = [
      { id: 1, maxrate: 120, minrate: 60, avgrate: 90, timestamp: "2025-04-01T08:39:26.839Z" },
    ];
    (fetchHeartRate as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useHeartRate("test@example.com", "2025-04-01T14:00:00", "Hour"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(fetchHeartRate).toHaveBeenCalledWith("test@example.com", "2025-04-01T14:00:00", "Hour");
  });

  it("should fetch SPO2 data successfully", async () => {
    const mockData = [{ id: 1, spO2: 98, maxSpO2: 100, minSpO2: 96, timestamp: "2025-04-01T08:39:44.704Z" }];
    (fetchSPO2 as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useSPO2("test@example.com", "2025-04-01T14:00:00", "Hour"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(fetchSPO2).toHaveBeenCalledWith("test@example.com", "2025-04-01T14:00:00", "Hour");
  });

  it("should fetch distance data successfully", async () => {
    const mockData = [{ id: 1, distance: 5.2, timestamp: "2025-04-01T08:39:55.325Z" }];
    (fetchDistance as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useDistance("test@example.com", "2025-04-01T14:00:00", "Hour"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(fetchDistance).toHaveBeenCalledWith("test@example.com", "2025-04-01T14:00:00", "Hour");
  });

  it("should fetch steps data successfully", async () => {
    const mockData = [{ id: 1, stepsCount: 1000, timestamp: "2025-04-01T08:40:05.296Z" }];
    (fetchSteps as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useSteps("test@example.com", "2025-04-01T14:00:00", "Hour"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(fetchSteps).toHaveBeenCalledWith("test@example.com", "2025-04-01T14:00:00", "Hour");
  });

  it("should handle API failure", async () => {
    (fetchHeartRate as jest.Mock).mockRejectedValue(new Error("Failed to fetch heart rate"));

    const { result } = renderHook(() => useHeartRate("test@example.com", "2025-04-01T14:00:00", "Hour"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });

    expect(result.current.error?.message).toBe("Failed to fetch heart rate");
  });
});

import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchEldersForCaregiver } from "@/apis/elderAPI";
import { useEldersForCaregiver } from "@/hooks/useElders";

jest.mock("@/apis/elderAPI");

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
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useElder hooks", () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("should fetch elders for caregiver successfully", async () => {
    const mockData = [
      { name: "Elder A", email: "elderA@example.com" },
      { name: "Elder B", email: "elderB@example.com" },
    ];
    (fetchEldersForCaregiver as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useEldersForCaregiver(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(fetchEldersForCaregiver).toHaveBeenCalled();
  });

  it("should handle failure in fetchEldersForCaregiver", async () => {
    (fetchEldersForCaregiver as jest.Mock).mockRejectedValue(new Error("Failed to fetch caregiver elders"));

    const { result } = renderHook(() => useEldersForCaregiver(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });

    expect(result.current.error?.message).toBe("Failed to fetch caregiver elders");
  });
});

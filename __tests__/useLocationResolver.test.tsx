import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import useLocationResolver from "@/hooks/useLocationResolver";

jest.mock("@/apis/axiosConfig", () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    interceptors: {
      response: { use: jest.fn() },
    },
    defaults: {
      headers: { common: {} },
    },
  };
  return {
    axiosInstance: mockAxiosInstance,
  };
});

import { axiosInstance } from "@/apis/axiosConfig";

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

describe("useLocationResolver", () => {
  it("should resolve location from valid address", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          address: {
            city: "New York",
            road: "5th Ave",
            house_number: "1",
            country: "USA",
          },
          lat: "40.7128",
          lon: "-74.0060",
        },
      ],
    });

    const { result } = renderHook(() => useLocationResolver("1 5th Ave, New York"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      {
        fullAddress: "New York 5th Ave 1 USA",
        lat: 40.7128,
        lon: -74.006,
      },
    ]);
  });

  it("should return empty array if location data is invalid", async () => {
    (axiosInstance.get as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        data: [
          {
            address: {
              city: "New York",
              road: undefined,
              house_number: "1",
              country: "USA",
            },
            lat: "40.7128",
            lon: "-74.0060",
          },
        ],
      })
    );

    const { result } = renderHook(() => useLocationResolver("1 5th Ave, New York"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });
});

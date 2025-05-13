import axios from "axios";
import { BASE_URL } from "@/utils/globals";
import { emitLogoutEvent } from "@/utils/logoutEmitter";
import * as SecureStore from "expo-secure-store";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setBearer = (token: string) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
type RenewTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

const attemptRefresh = async () => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await axiosInstance.post<RenewTokenResponse>(
    `/api/User/renew/token?token=${encodeURIComponent(refreshToken)}`
  );
  if (response.status === 200) {
    const data = response.data;
    console.log(data);

    if (!data.refreshToken || !data.accessToken) {
      throw new Error("Failed to refresh token: Missing refresh token or access token");
    }

    setBearer(data.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);
    return data.accessToken;
  } else {
    throw new Error("Failed to refresh token");
  }
};

let lastRefreshAttempt: number | null = null;

const FOURTEEN_MINUTES = 14 * 60 * 1000;

axiosInstance.interceptors.response.use(
  (response) => {
    //console.log(response.status + ": " + response.request.responseURL);
    return response;
  },
  async (error) => {
    //console.log(error.response?.status + ": " + error.request.responseURL);
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (lastRefreshAttempt && Date.now() - lastRefreshAttempt < FOURTEEN_MINUTES) {
      return Promise.reject(new Error("Token refresh already attempted recently"));
    }

    lastRefreshAttempt = Date.now();

    try {
      const newToken = await attemptRefresh();
      if (newToken) {
        console.log("Retrying request with new token:", newToken);
        return axiosInstance({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
    } catch (refreshError) {
      emitLogoutEvent();
    }
  }
);

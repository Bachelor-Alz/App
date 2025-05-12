import axios from "axios";
import { BASE_URL } from "@/utils/globals";
import { emitLogoutEvent } from "@/utils/logoutEmitter";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setBearer = (token: string) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const attemptRefresh = async () => {
  const response = await axiosInstance.get<string>("/api/User/renew/token");
  if (response.status === 200) {
    const newToken = response.data;
    console.log("New token received:", newToken);
    setBearer(newToken);
    return newToken;
  } else {
    throw new Error("Failed to refresh token");
  }
};

let lastRefreshAttempt: number | null = null;

const FIVE_MINUTES = 5 * 60 * 1000;

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

    if (lastRefreshAttempt && Date.now() - lastRefreshAttempt < FIVE_MINUTES) {
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

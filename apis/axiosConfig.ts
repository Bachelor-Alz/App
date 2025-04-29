import axios from "axios";
import { BASE_URL } from "@/utils/globals";
import { router } from "expo-router";

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

axiosInstance.interceptors.response.use(
  (response) => {
    //console.log(response.status + ": " + response.request.responseURL);
    return response;
  },
  async (error) => {
    //console.log(error.response?.status + ": " + error.request.responseURL);
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

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
      router.replace("/");
    }
  }
);

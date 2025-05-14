import { LoginForm } from "@/app/auth/Login";
import { axiosInstance } from "./axiosConfig";

export type LoginResponse = {
  token: string;
  role: 0 | 1;
  refreshToken: string;
  userId: string;
};

export const loginUserRequest = async (userData: LoginForm) => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/api/User/login", {
      email: userData.email,
      password: userData.password,
    });

    return {
      ...response.data,
    };
  } catch (error) {
    throw new Error((error as Error).message || "Login failed");
  }
};

export const refreshTokenAPI = async (token: string) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(`/api/User/login/token`, null, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message || "Token refresh failed");
  }
};

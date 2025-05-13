import { LoginForm } from "@/app";
import { axiosInstance } from "./axiosConfig";

type RefreshToken = {
  refreshToken: string;
};

export const revokeRefreshTokenAPI = async ({ refreshToken }: RefreshToken) => {
  try {
    const response = await axiosInstance.post<void>(
      `/api/User/revoke/token?token=${encodeURIComponent(refreshToken)}`
    );
  } catch (error) {
    throw new Error((error as Error).message || "Login failed");
  }
};

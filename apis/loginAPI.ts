import { LoginForm } from "@/app";
import { axiosInstance } from "./axiosConfig";

type LoginResponse = {
  token: string;
  role: number;
};

export const loginUserRequest = async (
  userData: LoginForm
): Promise<{
  role: number;
  token: string;
  email: string;
}> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/api/User/login", {
      email: userData.email,
      password: userData.password,
    });

    const { token, role } = response.data;

    if (!token || role === undefined) {
      throw new Error("Login failed: Missing token or role.");
    }

    return {
      token,
      email: userData.email,
      role,
    };
  } catch (error) {
    throw new Error((error as Error).message || "Login failed");
  }
};

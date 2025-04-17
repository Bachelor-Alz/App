import { LoginForm } from "@/app";
import { axiosInstance } from "./axiosConfig";

type LoginResponse = {
  token: string;
};

export const loginUserRequest = async (
  userData: LoginForm
): Promise<{
  role: number;
  token: string;
  email: string;
}> => {
  for (const role of [0, 1]) {
    try {
      const response = await axiosInstance.post<LoginResponse>(`/api/User/login`, {
        email: userData.email,
        password: userData.password,
        role,
      });

      return {
        token: response.data.token,
        email: userData.email,
        role,
      };
    } catch (error) {}
  }

  throw new Error("Login failed for both caregiver and elder roles.");
};

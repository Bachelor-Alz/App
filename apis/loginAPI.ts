import { LoginForm } from "@/app";
import { axiosInstance } from "./axiosConfig";

type LoginResponse = {
  token: string;
};

export const loginUserRequest = async (
  userData: LoginForm
): Promise<{
  role: number | undefined; // role can be undefined if not returned from API
  token: string;
  email: string;
} | null> => {
  const attemptLogin = async (role: number) => {
    try {
      const response = await axiosInstance.post<LoginResponse>(`/api/User/login`, {
        email: userData.email,
        password: userData.password,
        role,
      });

      return {
        token: response.data.token,
        email: userData.email,
        role: role,
      };
    } catch (error: any) {
      return null;
    }
  };

  // Try login as caregiver first
  const tokenAsCaregiver = await attemptLogin(0);
  if (tokenAsCaregiver) return tokenAsCaregiver;

  // Try login as elder second
  const tokenAsElder = await attemptLogin(1);
  if (tokenAsElder) return tokenAsElder;

  throw new Error("Login failed for both caregiver and elder roles.");
};

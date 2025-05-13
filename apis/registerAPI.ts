import { axiosInstance } from "./axiosConfig";

type CreateUserRequestProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  role: number;
};

export const createUserRequest = async (userData: CreateUserRequestProps) => {
  const { address, confirmPassword, ...rest } = userData;
  try {
    const res = await axiosInstance.post<void>(`/api/User/register`, rest);
    return res.data;
  } catch (error) {
    if (error) {
      throw new Error((error as any)?.message || "Error: Couldn't create user");
    }
  }
};

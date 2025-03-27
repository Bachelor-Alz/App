import { LoginForm } from '@/app';
import { axiosInstance } from './axiosConfig';

type LoginResponse = {
  token: string;
}

export const loginUserRequest = async (userData : LoginForm) : Promise<string> => {
    const data = {
        email : userData.email,
        password : userData.password,
        role : 0
    }
    const response = await axiosInstance
    .post<LoginResponse>(`/api/User/login`, data)
    .catch((error) => {
      if (error.response) {
        throw new Error(error.message || "Error: Couldn't create user");
      }
    });

    if (!response) {
      throw new Error("Error: No response received");
    }

    const { token } = response.data;
  return token
};
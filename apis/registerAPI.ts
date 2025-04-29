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

type CreateUserResponseProps = {
  name: string;
  email: string;
  role: number;
  id: string;
};

export const createUserRequest = (userData: CreateUserRequestProps): Promise<CreateUserResponseProps> => {
  const { address, confirmPassword, ...rest } = userData;
  console.log(userData);
  return axiosInstance
    .post(`/api/User/register`, rest)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response) {
        throw new Error(error.message || "Error: Couldn't create user");
      }
    });
};

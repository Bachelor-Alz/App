import { axiosInstance } from './axiosConfig';

type CreateUserRequestProps = {
  name: string;
  email: string;
  password: string;
  role: number;
}

type CreateUserResponseProps = {
  name: string;
  email: string;
  role: number;
  id: string;
}

export const createUserRequest = (userData: CreateUserRequestProps): Promise<CreateUserResponseProps> => {
  return axiosInstance
    .post(`/api/User/register`, userData)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response) {
        throw new Error(error.message || "Error: Couldn't create user");
      }
    });
};
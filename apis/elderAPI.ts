import { axiosInstance } from "./axiosConfig";

export const fetchAllElders = () => {
  return axiosInstance
    .get("/api/User/elder")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching elders:", error);
      throw error;
    });
};

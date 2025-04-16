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

export const fetchEldersForCaregiver = async () => {
  try {
    const response = await axiosInstance.get("/api/User/users/getElders");
    return response.data;
  } catch (error) {
    console.error("Error fetching elders:", error);
    throw error;
  }
};

export const assignCaregiverToElder = async (elderEmail: string, caregiverEmail: string) => {
  try {
    const response = await axiosInstance.post(
      `/api/User/users/elder`,
      { elderEmail },
      {
        params: { caregiverEmail },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning caregiver to elder:", error);
    throw error;
  }
};

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
      {},
      {
        params: {
          elderEmail,
          caregiverEmail,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning caregiver to elder:", error);
    throw error;
  }
};

export const fetchCaregiverInvites = async () => {
  try {
    const response = await axiosInstance.get(`/api/User/caregiver/invites`);
    return response.data;
  } catch (error) {
    console.error("Error fetching caregiver invites:", error);
    throw error;
  }
};

export const acceptCaregiverInvite = async (elderEmail: string) => {
  try {
    const response = await axiosInstance.post("/api/User/caregiver/invites/accept", null, {
      params: { elderEmail },
    });
    return response.data;
  } catch (error) {
    console.error("Error accepting caregiver invite:", error);
    throw error;
  }
};

export const fetchArduino = async () => {
  try {
    const response = await axiosInstance.get("/api/User/users/arduino");
    return response.data;
  } catch (error) {
    console.error("Error fetching Arduino data:", error);
    throw error;
  }
};

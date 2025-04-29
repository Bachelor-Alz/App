import { axiosInstance } from "./axiosConfig";

export const fetchAllElders = () => {
  return axiosInstance
    .get("/api/User/elder")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const fetchEldersForCaregiver = async () => {
  try {
    const response = await axiosInstance.get("/api/User/users/getElders");
    return response.data;
  } catch (error) {
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
    throw error;
  }
};

export const fetchCaregiverInvites = async () => {
  try {
    const response = await axiosInstance.get(`/api/User/caregiver/invites`);
    return response.data;
  } catch (error) {
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
    throw error;
  }
};

export const fetchArduino = async () => {
  try {
    const response = await axiosInstance.get("/api/User/users/arduino");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignArduinoToElder = async (arduinoAddress: string) => {
  try {
    const response = await axiosInstance.post(
      "/api/User/users/arduino",
      {},
      {
        params: { address: arduinoAddress },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCaregiverForElder = async () => {
  try {
    const response = await axiosInstance.get(`/api/User/users/elder/caregiver`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeCaregiverFromElder = async (caregiverEmail: string) => {
  try {
    const response = await axiosInstance.delete(`/api/User/users/elder/removeCaregiver`, {
      params: { caregiverEmail },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeElderFromCaregiver = async (elderEmail: string) => {
  try {
    const response = await axiosInstance.delete(`/api/User/users/caregiver/removeFromElder`, {
      params: { elderEmail },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const testArduinoConnection = async (elderEmail: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/api/User/connected`, {
      params: { elderEmail },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

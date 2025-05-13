import { axiosInstance } from "./axiosConfig";

export type Elder = {
  userId: string;
  email: string;
  name: string;
  role: 1;
};

export const fetchEldersForCaregiver = async () => {
  try {
    const response = await axiosInstance.get<Elder[]>("/api/User/users/getElders");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignCaregiverToElder = async (caregiverEmail: string) => {
  try {
    await axiosInstance.post<void>(
      `/api/User/users/elder`,
      {},
      {
        params: {
          caregiverEmail,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const fetchCaregiverInvites = async () => {
  try {
    const response = await axiosInstance.get<Elder[]>(`/api/User/caregiver/invites`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptCaregiverInvite = async (elderId: string) => {
  try {
    await axiosInstance.post<void>("/api/User/caregiver/invites/accept", null, {
      params: { elderId },
    });
  } catch (error) {
    throw error;
  }
};

export type Arduino = {
  id: number;
  macAddress: string;
  address: string;
  distance: number;
  lastActivity: number;
};

export const fetchArduinos = async () => {
  try {
    const response = await axiosInstance.get<Arduino[]>("/api/User/users/arduino");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignArduinoToElder = async (arduinoAddress: string) => {
  try {
    await axiosInstance.post<void>(
      "/api/User/users/arduino",
      {},
      {
        params: { address: arduinoAddress },
      }
    );
  } catch (error) {
    throw error;
  }
};

export type Caregiver = {
  userId: string;
  email: string;
  name: string;
  role: 0;
};

export const fetchCaregiverForElder = async () => {
  try {
    const response = await axiosInstance.get<Caregiver[]>(`/api/User/users/elder/caregiver`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeCaregiverFromElder = async () => {
  try {
    await axiosInstance.delete<void>(`/api/User/users/elder/removeCaregiver`);
  } catch (error) {
    throw error;
  }
};

export const removeElderFromCaregiver = async (elderId: string) => {
  try {
    await axiosInstance.delete<void>(`/api/User/users/caregiver/removeFromElder`, {
      params: { elderId },
    });
  } catch (error) {
    throw error;
  }
};

export const testArduinoConnection = async () => {
  try {
    const response = await axiosInstance.get<boolean>(`/api/User/connected`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeArduinoFromElder = async () => {
  try {
    await axiosInstance.delete<void>(`/api/User/users/arduino`);
  } catch (error) {
    throw error;
  }
};

import { createContext, useCallback, useContext, useState } from "react";
import { createUserRequest } from "@/apis/registerAPI";
import { RegisterForm } from "@/app/register";
import { LoginForm } from "@/app";
import { loginUserRequest } from "@/apis/loginAPI";
import { setBearer } from "@/apis/axiosConfig";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

type AuthenticationProviderProps = {
  register: (form: RegisterForm) => Promise<string | null>;
  login: (form: LoginForm) => Promise<number>;
  logout: () => Promise<void>;
  userEmail: string | null;
  role: number | undefined;
};

const AuthenticationContext = createContext<AuthenticationProviderProps | undefined>(undefined);

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<number | undefined>(undefined);

  const register = useCallback(async (form: RegisterForm) => {
    try {
      const res = await createUserRequest(form);
      return res.id;
    } catch (error) {
      throw new Error("Failed to register user");
    }
  }, []);

  const login = useCallback(async (form: LoginForm): Promise<number> => {
    try {
      const response = await loginUserRequest(form);

      if (!response?.token || !response.email || response.role === undefined) {
        throw new Error("Login failed: Missing token, email or role.");
      }

      const { token, email, role } = response;
      setBearer(token);
      setUserEmail(email);
      setRole(role);

      return role;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("rememberedEmail");
      await SecureStore.deleteItemAsync("password");
      setUserEmail(null);
      setRole(undefined);
      router.dismissAll();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <AuthenticationContext.Provider value={{ register, login, logout, userEmail, role }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error("useAuthentication must be used within an AuthenticationProvider");
  }
  return context;
};

export { AuthenticationProvider, AuthenticationContext };

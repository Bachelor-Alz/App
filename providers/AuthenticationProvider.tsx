import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createUserRequest } from "@/apis/registerAPI";
import { RegisterForm } from "@/app/register";
import { LoginForm } from "@/app";
import { loginUserRequest } from "@/apis/loginAPI";
import { setBearer } from "@/apis/axiosConfig";
import * as SecureStore from "expo-secure-store";
import { useNavigationContainerRef } from "expo-router";
import { useToast } from "./ToastProvider";
import { addLogoutListener, removeLogoutListener } from "@/utils/logoutEmitter";

type AuthenticationProviderProps = {
  register: (form: RegisterForm) => Promise<string | null>;
  login: (form: LoginForm) => Promise<number | undefined>;
  logout: () => Promise<void>;
  userEmail: string | null;
  role: number | undefined;
};

const AuthenticationContext = createContext<AuthenticationProviderProps | undefined>(undefined);

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<number | undefined>(undefined);
  const { addToast } = useToast();
  const rootNavigation = useNavigationContainerRef();

  const register = useCallback(
    async (form: RegisterForm): Promise<string | null> => {
      try {
        const res = await createUserRequest(form);
        return res.id;
      } catch (e: any) {
        addToast("Error", e.message);
        return null;
      }
    },
    [addToast]
  );

  const login = useCallback(
    async (form: LoginForm): Promise<number | undefined> => {
      try {
        const res = await loginUserRequest(form);
        if (!res?.token || !res.email || res.role === undefined) {
          addToast("Error", "Invalid response from server");
        }
        const { token, email, role } = res;
        setBearer(token);
        setUserEmail(email);
        setRole(role);
        return role;
      } catch (e: any) {
        addToast("Error", e.message);
      }
    },
    [addToast]
  );

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("rememberedEmail");
      await SecureStore.deleteItemAsync("password");
      setUserEmail(null);
      setRole(undefined);
      setBearer("");
      rootNavigation.resetRoot({
        index: 0,
        routes: [{ name: "index" }],
      });
    } catch (error) {
      addToast("Error", "Failed to log out");
      throw error;
    }
  }, []);

  useEffect(() => {
    addLogoutListener(logout);

    return () => {
      removeLogoutListener(logout);
    };
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

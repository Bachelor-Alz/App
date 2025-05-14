import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createUserRequest } from "@/apis/registerAPI";
import { RegisterForm } from "@/app/Register";
import { LoginResponse, loginUserRequest } from "@/apis/loginAPI";
import { setBearer } from "@/apis/axiosConfig";
import * as SecureStore from "expo-secure-store";
import { useToast } from "./ToastProvider";
import { addLogoutListener, removeLogoutListener } from "@/utils/logoutEmitter";
import { revokeRefreshTokenAPI } from "@/apis/revokeRefreshTokenAPI";
import { useNavigationContainerRef } from "@react-navigation/native";
import { LoginForm } from "@/app/Login";

/**
 * Represents a potentially authenticated user and provides authentication-related actions.
 * @property role The user's role, where 0 is a caregiver and 1 is an elder.
 */
type AuthenticationProviderProps = {
  register: (form: RegisterForm) => Promise<void | null>;
  login: (form: LoginForm) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  role: 0 | 1 | null;
  userId: string | null;
};

const AuthenticationContext = createContext<AuthenticationProviderProps | undefined>(undefined);

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<0 | 1 | null>(null);
  const { addToast } = useToast();
  const rootNavigation = useNavigationContainerRef();

  const register = useCallback(
    async (form: RegisterForm) => {
      try {
        await createUserRequest(form);
      } catch (e: any) {
        addToast("Error", e.message);
        return null;
      }
    },
    [addToast]
  );

  const login = useCallback(
    async (form: LoginForm) => {
      try {
        const res = (await loginUserRequest(form)) as LoginResponse;
        const { token, role, refreshToken, userId } = res;
        setUserId(userId);
        setBearer(token);
        setRole(role);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        return res;
      } catch (e: any) {
        addToast("Error", e.message);
        throw e;
      }
    },
    [addToast]
  );

  const logout = useCallback(async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        await revokeRefreshTokenAPI({ refreshToken });
      }
      await SecureStore.deleteItemAsync("rememberedEmail");
      await SecureStore.deleteItemAsync("password");
      await SecureStore.deleteItemAsync("refreshToken");
      setRole(null);
      setBearer("");
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
    <AuthenticationContext.Provider value={{ register, login, logout, role, userId }}>
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

/**
 * Represents an authenticated user and provides authentication-related actions. Without potential null values.
 * @property role The user's role, where 0 is a caregiver and 1 is an elder.
 */
type AuthenticatedUser = {
  register: (form: RegisterForm) => Promise<void | null>;
  login: (form: LoginForm) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  role: 0 | 1;
  userId: string;
};

export const useAuthenticatedUser = (): AuthenticatedUser => {
  const all = useAuthentication();

  if (all.userId === null || all.role === null) {
    throw new Error("User is not authenticated");
  }

  return all as AuthenticatedUser;
};

export { AuthenticationProvider, AuthenticationContext };

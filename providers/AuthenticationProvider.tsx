import { createContext, useCallback, useContext } from "react";
import { createUserRequest } from "@/apis/registerAPI";
import { RegisterForm } from "@/app/register";
import { LoginForm } from "@/app/index"
import { loginUserRequest } from "@/apis/loginAPI";
import { setBearer } from "@/apis/axiosConfig";

type AuthenticationProviderProps = {
  register: (form: RegisterForm) => Promise<string | null>;
  login: (form: LoginForm) => Promise<void>;
}

const AuthenticationContext = createContext<AuthenticationProviderProps | undefined>(undefined);

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {

  const register = useCallback(async (form: RegisterForm) => {
    try {
      const res = await createUserRequest(form);
      return res.id;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const login = useCallback(async (form: LoginForm) => {
    try {
      const token = await loginUserRequest(form);
      setBearer(token);
    } catch (error) {
      console.log(error)
    }
  }, []);

  return (
    <AuthenticationContext.Provider value={{ register, login }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error("useAuthentication skal bruges i en AuthenticationProvider");
  }
  return context;
};

export { AuthenticationProvider, AuthenticationContext };
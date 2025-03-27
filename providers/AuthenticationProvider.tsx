import { createContext, useCallback, useContext } from "react";
import { createUserRequest } from "@/apis/registerAPI";
import { RegisterForm } from "@/app/register";

type AuthenticationProviderProps = {
  register: (form: RegisterForm) => Promise<string | null>;
}

const AuthenticationContext = createContext<AuthenticationProviderProps | undefined>(undefined);

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {

  const register = useCallback(async (form: RegisterForm) => {
    try {
      const res = await createUserRequest(form);
      return res.id;
    } catch (error) {
      throw new Error("Failed to register user");
    }
  }, []);


  return (
    <AuthenticationContext.Provider value={{ register }}>
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
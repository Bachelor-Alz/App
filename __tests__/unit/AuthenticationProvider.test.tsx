import { AuthenticationProvider, useAuthentication } from "@/providers/AuthenticationProvider";
import { renderHook, act } from "@testing-library/react-native";
import { createUserRequest } from "@/apis/registerAPI";
import { loginUserRequest } from "@/apis/loginAPI";
import * as SecureStore from "expo-secure-store";
import { ToastProvider } from "@/providers/ToastProvider";
import { RegisterForm } from "@/app/auth/Register";

// Mock the API requests
jest.mock("../../apis/registerAPI");
jest.mock("../../apis/loginAPI");
jest.mock("expo-secure-store");
jest.mock("expo-font");

const wrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <ToastProvider>
      <AuthenticationProvider>{children}</AuthenticationProvider>
    </ToastProvider>
  );
};

describe("AuthenticationProvider", () => {
  it("Should return an authentication provider", async () => {
    const { result } = renderHook(() => useAuthentication(), { wrapper });
    expect(result.current).not.toBeNull();
  });

  it("should throw error if used outside of provider", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      renderHook(() => useAuthentication());
    } catch (error) {
      expect(error).toEqual(new Error("useAuthentication must be used within an AuthenticationProvider"));
    }
    consoleErrorMock.mockRestore();
  });

  it("Should return null if register fails", async () => {
    (createUserRequest as jest.Mock).mockRejectedValue(new Error("Registration failed"));

    const { result } = renderHook(() => useAuthentication(), { wrapper });

    await act(async () => {
      const userId = await result.current.register({
        email: "test@gmail.com",
        name: "Test User",
        password: "Password123!",
        confirmPassword: "Password123!",
        role: 0,
      });
    });
  });

  it("Should successfully register a user and return an ID", async () => {
    (createUserRequest as jest.Mock).mockResolvedValue({ id: "12345" });

    const { result } = renderHook(() => useAuthentication(), { wrapper });

    await act(async () => {
      const res = await result.current.register({
        email: "test@example.com",
        name: "Test User",
        password: "Password123!",
        confirmPassword: "Password123!",
        role: 0,
      });
      expect(res).toBeUndefined();
    });
  });

  it("Should call createUserRequest with correct parameters", async () => {
    const mockForm: RegisterForm = {
      email: "test@example.com",
      name: "Test User",
      password: "Password123!",
      confirmPassword: "Password123!",
      role: 0,
    };

    (createUserRequest as jest.Mock).mockResolvedValue({ id: "12345" });

    const { result } = renderHook(() => useAuthentication(), { wrapper });

    await act(async () => {
      await result.current.register(mockForm);
    });

    expect(createUserRequest).toHaveBeenCalledWith(mockForm);
  });

  it("should update userId and role after successful login", async () => {
    (loginUserRequest as jest.Mock).mockResolvedValue({
      token: "valid-token",
      email: "test@example.com",
      role: 1,
      refreshToken: "valid-refresh-token",
      userId: "12345",
    });

    const { result } = renderHook(() => useAuthentication(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: "test@example.com",
        password: "Password123!",
      });
    });

    expect(result.current.userId).toBe("12345");
    expect(result.current.role).toBe(1);
  });

  it("should reset userId and role after logout", async () => {
    const mockLoginResponse = {
      token: "valid-token",
      email: "test@example.com",
      role: 0,
      refreshToken: "valid-refresh-token",
      userId: "12345",
    };

    (loginUserRequest as jest.Mock).mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuthentication(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: "test@example.com",
        password: "Password123!",
      });
    });

    expect(result.current.userId).toBe("12345");
    expect(result.current.role).toBe(0);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.userId).toBeNull();
    expect(result.current.role).toBeNull();
  });

  it("should delete user credentials from SecureStore after logout", async () => {
    const secureStoreDeleteMock = jest.spyOn(SecureStore, "deleteItemAsync").mockResolvedValue();

    const { result } = renderHook(() => useAuthentication(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(secureStoreDeleteMock).toHaveBeenCalledWith("rememberMe");
    expect(secureStoreDeleteMock).toHaveBeenCalledWith("refreshToken");
    secureStoreDeleteMock.mockRestore();
  });
});

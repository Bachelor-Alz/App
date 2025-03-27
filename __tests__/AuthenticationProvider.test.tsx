import { AuthenticationProvider, useAuthentication } from "@/providers/AuthenticationProvider";
import { renderHook, act } from "@testing-library/react-native";
import { createUserRequest } from "@/apis/registerAPI";
import { RegisterForm } from "@/app/register";

jest.mock("../apis/registerAPI");

describe("AuthenticationProvider", () => {
  it("Should return an authentication provider", async () => {
    const { result } = renderHook(() => useAuthentication(), { wrapper: AuthenticationProvider });
    expect(result.current).not.toBeNull();
  });

  it("should throw error if used outside of provider", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      renderHook(() => useAuthentication());
    } catch (error) {
      expect(error).toEqual(new Error("useAuthentication skal bruges i en AuthenticationProvider"));
    }
    consoleErrorMock.mockRestore();
  });

  it("Should throw error if failed to register user", async () => {
    (createUserRequest as jest.Mock).mockRejectedValue(new Error("Failed to register user"));

    const { result } = renderHook(() => useAuthentication(), { wrapper: AuthenticationProvider });

    await expect(result.current.register({ email: "test@example.com", name: "Test User", password: "Password123!", confirmPassword: "Password123!", role: 0 }))
      .rejects.toThrow("Failed to register user");
  });

  it("Should successfully register a user and return an ID", async () => {
    (createUserRequest as jest.Mock).mockResolvedValue({ id: "12345" });

    const { result } = renderHook(() => useAuthentication(), { wrapper: AuthenticationProvider });

    await act(async () => {
      const userId = await result.current.register({
        email: "test@example.com",
        name: "Test User",
        password: "Password123!",
        confirmPassword: "Password123!",
        role: 0
      });
      expect(userId).toBe("12345");
    });
  });

  it("Should call createUserRequest with correct parameters", async () => {
    const mockForm: RegisterForm = {
      email: "test@example.com",
      name: "Test User",
      password: "Password123!",
      confirmPassword: "Password123!",
      role: 0 as 0 | 1,
    };


    (createUserRequest as jest.Mock).mockResolvedValue({ id: "12345" });

    const { result } = renderHook(() => useAuthentication(), { wrapper: AuthenticationProvider });

    await act(async () => {
      await result.current.register(mockForm);
    });

    expect(createUserRequest).toHaveBeenCalledWith(mockForm);
  });
});

import { createTheme } from "@/constants/CreateTheme";
import { AuthenticationProvider } from "@/providers/AuthenticationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "./ToastProvider";
import { THEME_STORAGE_KEY, ThemeProvider, useThemeContext } from "./ThemeProvider";
import * as SecureStore from "expo-secure-store";
import { useMemo } from "react";
const queryClient = new QueryClient();
const initialThemeMode = SecureStore.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";

type ProviderWrapperProps = {
  children: React.ReactNode;
};

const ProviderWrapperContent = ({ children }: { children: React.ReactNode }) => {
  const { themeMode } = useThemeContext();

  const theme = useMemo(() => {
    return createTheme(themeMode === "dark");
  }, [themeMode]);

  return (
    <PaperProvider theme={theme}>
      <ToastProvider>
        <AuthenticationProvider>{children}</AuthenticationProvider>
      </ToastProvider>
    </PaperProvider>
  );
};

const ProviderWrapper = ({ children }: ProviderWrapperProps) => {
  return (
    <ThemeProvider storedColorPreference={initialThemeMode}>
      <QueryClientProvider client={queryClient}>
        <ProviderWrapperContent>{children}</ProviderWrapperContent>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default ProviderWrapper;

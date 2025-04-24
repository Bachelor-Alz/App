import { createTheme } from "@/constants/CreateTheme";
import { AuthenticationProvider } from "@/providers/AuthenticationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "./ToastProvider";

type CustomLayoutProps = {
  children: React.ReactNode;
};

const ProviderWrapper = ({ children }: CustomLayoutProps) => {
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === "dark");
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <ToastProvider>
          <AuthenticationProvider>{children}</AuthenticationProvider>
        </ToastProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default ProviderWrapper;

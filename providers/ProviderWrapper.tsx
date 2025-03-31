import { createTheme } from "@/constants/CreateTheme";
import { AuthenticationProvider } from "@/providers/AuthenticationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";

type CustomLayoutProps = {
  children: React.ReactNode;
};

const ProviderWrapper = ({ children }: CustomLayoutProps) => {
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === "dark");
  const queryClient = new QueryClient();

  return (
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>{children}</PaperProvider>
      </QueryClientProvider>
    </AuthenticationProvider>
  );
};

export default ProviderWrapper;

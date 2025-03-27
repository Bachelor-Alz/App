import { createTheme } from "@/constants/CreateTheme";
import { AuthenticationProvider } from "@/providers/AuthenticationProvider";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";


type CustomLayoutProps = {
  children: React.ReactNode;
};

const ProviderWrapper = ({ children }: CustomLayoutProps) => {
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === "dark");

  return (
    <AuthenticationProvider>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </AuthenticationProvider>
  );
}

export default ProviderWrapper;
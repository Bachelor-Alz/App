import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const createTheme = (isDarkMode: boolean) => ({
  ...(isDarkMode ? MD3DarkTheme : MD3LightTheme),
  colors: {
    ...(isDarkMode ? MD3DarkTheme.colors : MD3LightTheme.colors),
    background: isDarkMode ? "#121212" : "#f9f9f9",
    surface: isDarkMode ? "#1e1e1e" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#000000",
    primary: "#7ae00b",
    secondary: "#007AFF",
    tertiary: "#FFA500",
  },
});

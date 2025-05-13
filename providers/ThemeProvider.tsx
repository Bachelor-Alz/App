import { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import * as SecureStore from "expo-secure-store";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const THEME_STORAGE_KEY = "userThemeMode";

export const ThemeProvider = ({
  children,
  storedColorPreference,
}: {
  children: React.ReactNode;
  storedColorPreference: ThemeMode;
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    Appearance.setColorScheme(storedColorPreference);
    return storedColorPreference;
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme && !SecureStore.getItem(THEME_STORAGE_KEY)) {
        setThemeMode(colorScheme === "dark" ? "dark" : "light");
        Appearance.setColorScheme(colorScheme === "dark" ? "dark" : "light");
      }
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = async () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";

      SecureStore.setItemAsync(THEME_STORAGE_KEY, newMode).catch((error) => {
        console.error("Failed to save theme preference to SecureStore", error);
      });
      Appearance.setColorScheme(newMode === "dark" ? "dark" : "light");
      return newMode;
    });
  };

  return <ThemeContext.Provider value={{ themeMode, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

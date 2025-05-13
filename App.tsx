import { useFonts } from "expo-font";
import { Text } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import ProviderWrapper from "@/providers/ProviderWrapper";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ProviderWrapper>
      <Text>Welcome to the app!</Text>
    </ProviderWrapper>
  );
}

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import ProviderWrapper from "./providers/ProviderWrapper";
import RootStack from "./app/navigation/RootNavigator";
import { useEffect } from "react";

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
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </ProviderWrapper>
  );
}

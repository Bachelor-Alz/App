import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import "react-native-reanimated";
import ProviderWrapper from "@/providers/ProviderWrapper";
import { NavigationContainer } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  React.useEffect(() => {
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
        <Stack.Navigator></Stack.Navigator>
      </NavigationContainer>
    </ProviderWrapper>
  );
}

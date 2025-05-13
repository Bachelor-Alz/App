import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ElderTabNavigator from "./ElderTabNavigator";

const Stack = createNativeStackNavigator();

export default function ElderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ElderTabs" component={ElderTabNavigator} />
    </Stack.Navigator>
  );
}

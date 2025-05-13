import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CaregiverTabNavigator from "./CaregiverTabNavigator";

const Stack = createNativeStackNavigator();

export default function CaregiverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CaregiverTabs" component={CaregiverTabNavigator} />
    </Stack.Navigator>
  );
}

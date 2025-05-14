import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./navigation";
import LoginScreen from "../auth/Login";
import RegisterScreen from "../auth/Register";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

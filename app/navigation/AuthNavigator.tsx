import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../Login";
import RegisterScreen from "../Register";
import { AuthStackParamList } from "./navigation";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

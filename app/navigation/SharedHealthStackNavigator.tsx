import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SharedHealthStackParamList } from "./navigation";
import StepsScreen from "../health/Step";
import FallsCountScreen from "../health/Fall";
import SPO2Screen from "../health/SpO2";
import HeartRateScreen from "../health/HeartRate";
import DistanceScreen from "../health/Distance";

const Stack = createNativeStackNavigator<SharedHealthStackParamList>();

export default function SharedHealthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SPO2" component={SPO2Screen} />
      <Stack.Screen name="HeartRate" component={HeartRateScreen} />
      <Stack.Screen name="Steps" component={StepsScreen} />
      <Stack.Screen name="Fall" component={FallsCountScreen} />
      <Stack.Screen name="Distance" component={DistanceScreen} />
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ElderTabNavigator from "./ElderTabNavigator";
import SharedHealthStackNavigator from "./SharedHealthStackNavigator";
import { ElderTabParamList } from "./navigation";
import AssignCaregiverScreen from "../elder_only/assigncaregiver";
import ElderPerimeterMap from "../elder_only/map_elder";
import RemoveCaregiver from "../elder_only/removecaregiver";
import ViewArduino from "../elder_only/viewarduino";

const Stack = createNativeStackNavigator<ElderTabParamList>();

export default function ElderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ElderTabs" component={ElderTabNavigator} />
      <Stack.Screen name="SharedHealth" component={SharedHealthStackNavigator} />
      <Stack.Screen name="AssignCaregiver" component={AssignCaregiverScreen} />
      <Stack.Screen name="MapElder" component={ElderPerimeterMap} />
      <Stack.Screen name="RemoveCaregiver" component={RemoveCaregiver} />
      <Stack.Screen name="ViewArduino" component={ViewArduino} />
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CaregiverTabNavigator from "./CaregiverTabNavigator";
import SharedHealthStackNavigator from "./SharedHealthStackNavigator";
import { CaregiverTabParamList } from "./navigation";
import ElderHomeAsCaregiverPage from "../caregiver_only/ElderHomeAsCaregiver";
import MapCaregiver from "../caregiver_only/MapCaregiver";
import ViewElders from "../caregiver_only/ViewElder";
import ViewCaregiverInvites from "../caregiver_only/CaregiverInvites";

const Stack = createNativeStackNavigator<CaregiverTabParamList>();

export default function CaregiverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CaregiverTabs" component={CaregiverTabNavigator} />
      <Stack.Screen name="ElderHomeAsCaregiver" component={ElderHomeAsCaregiverPage} />
      <Stack.Screen name="ViewElder" component={ViewElders} />
      <Stack.Screen name="CaregiverInvites" component={ViewCaregiverInvites} />
      <Stack.Screen name="MapCaregiver" component={MapCaregiver} />
      <Stack.Screen name="SharedHealth" component={SharedHealthStackNavigator} />
    </Stack.Navigator>
  );
}

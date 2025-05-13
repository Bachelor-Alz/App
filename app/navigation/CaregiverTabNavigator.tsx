import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CaregiverHomePage from "../CaregiverHomePage";
import SettingsPage from "../settings";
import { CaregiverTabParamList } from "./navigation";

const Tab = createBottomTabNavigator<CaregiverTabParamList>();

export default function CaregiverTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={CaregiverHomePage} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
}

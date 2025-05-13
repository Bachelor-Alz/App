import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ElderHomePage from "../ElderHomePage";
import SettingsPage from "../settings";
import { ElderTabParamList } from "./navigation";

const Tab = createBottomTabNavigator<ElderTabParamList>();

export default function ElderTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={ElderHomePage} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
}

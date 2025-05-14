import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SettingsPage from "../elder_only/SettingsElder";
import { ElderTabParamList } from "./navigation";
import { useTheme } from "react-native-paper";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useAuthenticatedUser } from "@/providers/AuthenticationProvider";
import ElderHomePage from "../elder_only/ElderHomePage";

const Tab = createBottomTabNavigator<ElderTabParamList>();

export default function ElderTabNavigator() {
  const theme = useTheme();
  const { userId } = useAuthenticatedUser();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,

          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={ElderHomePage}
        initialParams={{ elderId: userId }}
        options={{
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarIcon: ({ color }) => <IconSymbol name="gear" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

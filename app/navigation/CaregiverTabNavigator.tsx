import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CaregiverHomePage from "../CaregiverHomePage";
import { CaregiverTabParamList } from "./navigation";
import { useTheme } from "react-native-paper";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { IconSymbol } from "@/components/ui/IconSymbol";
import SettingsPageCaregiver from "../SettingsCaregiver";

const Tab = createBottomTabNavigator<CaregiverTabParamList>();

export default function CaregiverTabNavigator() {
  const theme = useTheme();
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
        component={CaregiverHomePage}
        options={{
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPageCaregiver}
        options={{
          tabBarIcon: ({ color }) => <IconSymbol name="gear" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

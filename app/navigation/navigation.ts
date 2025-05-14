import { NavigatorScreenParams } from "@react-navigation/native";

export type SharedHealthStackParamList = {
  SPO2: { id: string };
  HeartRate: { id: string };
  Steps: { id: string };
  Distance: { id: string };
  Fall: { id: string };
};

export type CaregiverTabParamList = {
  Home: undefined;
  Settings: undefined;
  MapCaregiver: undefined;
  CaregiverInvites: undefined;
  ViewElder: undefined;
  ElderHomeAsCaregiver: { elderId: string };
  CaregiverTabs: undefined;
  SharedHealth: NavigatorScreenParams<SharedHealthStackParamList>;
};

export type ElderTabParamList = {
  Settings: undefined;
  AssignCaregiver: undefined;
  MapElder: undefined;
  RemoveCaregiver: undefined;
  ViewArduino: undefined;
  Home: { elderId: string };
  ElderTabs: undefined;
  SharedHealth: NavigatorScreenParams<SharedHealthStackParamList>;
};

export type RootStackParamList = {
  Auth: undefined;
  CaregiverApp: undefined;
  ElderApp: { elderId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

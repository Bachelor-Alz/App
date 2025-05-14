import { useAuthentication } from "@/providers/AuthenticationProvider";
import AuthNavigator from "./AuthNavigator";
import CaregiverNavigator from "./CaregiverNavigator";
import ElderNavigator from "./ElderNavigator";

export default function RootStack() {
  const { role } = useAuthentication();

  if (role === null) return <AuthNavigator />;
  if (role === 0) return <CaregiverNavigator />;
  if (role === 1) return <ElderNavigator />;

  return null;
}

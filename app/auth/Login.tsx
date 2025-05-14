import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, Checkbox, Button, useTheme } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/forms/Formfield";
import FormContainer from "@/components/forms/FormContainer";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import SmartAreaView from "@/components/SmartAreaView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/navigation";

const schema = z.object({
  email: z.string().email("Needs to be a valid email address").trim(),
  password: z.string().min(1).trim(),
});

export type LoginForm = z.infer<typeof schema>;
type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const { login, refreshTokenLogin } = useAuthentication();
  const [rememberMe, setRememberMe] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    const loginRefresh = async () => {
      console.log("HELLO");
      const rememberMe = await SecureStore.getItemAsync("rememberMe");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!rememberMe || !refreshToken) {
        return;
      }
      await refreshTokenLogin();
    };
    loginRefresh();

    return () => {
      SecureStore.deleteItemAsync("remeberMe");
    };
  }, []);

  const handleRememberMePress = async () => {
    if (rememberMe) {
      await SecureStore.setItemAsync("rememberMe", "true");
    } else {
      await SecureStore.deleteItemAsync("rememberMe");
    }
  };

  const onSubmit = async (data: LoginForm) => {
    await login(data);
  };

  return (
    <SmartAreaView>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <FormContainer>
          <Text
            variant="headlineLarge"
            style={{ fontWeight: "bold", marginBottom: 20, color: theme.colors.onSurface }}>
            Login
          </Text>
          <FormField name="email" control={control} placeholder="Enter your email" />
          <FormField name="password" control={control} placeholder="Enter your password" secureTextEntry />

          {/* Remember Me Checkbox */}
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
            <Checkbox.Android
              status={rememberMe ? "checked" : "unchecked"}
              onPress={() => {
                setRememberMe(!rememberMe);
                handleRememberMePress();
              }}
            />
            <Text style={{ color: theme.colors.onSurface }}>Remember Me</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Button
              mode="outlined"
              textColor={theme.colors.onSurface}
              disabled={!isValid}
              style={{ marginTop: 10 }}
              icon={"key"}
              onPress={handleSubmit(onSubmit)}>
              Login
            </Button>
            <Button
              mode="outlined"
              textColor={theme.colors.onSurface}
              style={{ marginTop: 5 }}
              icon={"account-plus"}
              onPress={() => navigation.navigate("Register")}>
              Register
            </Button>
          </View>
        </FormContainer>
      </View>
    </SmartAreaView>
  );
}

export default LoginScreen;

import React, { useEffect, useState } from "react";
import { View, SafeAreaView } from "react-native";
import { Text, Checkbox } from "react-native-paper";
import { Button, useTheme } from "react-native-paper";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/forms/Formfield";
import FormContainer from "@/components/forms/FormContainer";
import { useAuthentication } from "@/providers/AuthenticationProvider";

const schema = z.object({
  email: z.string().email("Indtast en gyldig e-mailadresse").trim(),
  password: z.string().min(1).trim(),
});

export type LoginForm = z.infer<typeof schema>;

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const theme = useTheme();
  const { login } = useAuthentication();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadAndAutoLogin = async () => {
      const savedEmail = await SecureStore.getItemAsync("rememberedEmail");
      const savedPassword = await SecureStore.getItemAsync("password");

      if (savedEmail) {
        setValue("email", savedEmail);
        setRememberMe(true);
      }

      if (savedEmail && savedPassword) {
        setValue("password", savedPassword);

        login({ email: savedEmail, password: savedPassword })
          .then(() => {
            router.navigate("/(tabs)");
          })
          .catch((error) => {
            console.error("Auto-login failed:", error);
          });
      }
    };

    loadAndAutoLogin();
  }, []);

  const onSubmit = async (data: LoginForm) => {
    if (rememberMe) {
      await SecureStore.setItemAsync("rememberedEmail", data.email);
      await SecureStore.setItemAsync("password", data.password);
    } else {
      await SecureStore.deleteItemAsync("rememberedEmail");
      await SecureStore.deleteItemAsync("password");
    }

    try {
      const role = await login(data);

      if (role === 0) {
        router.push("/(tabs)/caregiveroverview");
      } else if (role === 1) {
        router.push("/(tabs)");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}>
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
            onPress={() => setRememberMe(!rememberMe)}
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
            onPress={() => router.push("/register")}>
            Register
          </Button>
        </View>
      </FormContainer>
    </SafeAreaView>
  );
};

export default LoginScreen;

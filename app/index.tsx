import React from "react";
import { View, SafeAreaView } from "react-native";
import { Text } from "react-native-paper";
import { Button, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/forms/Formfield";
import FormContainer from "@/components/forms/FormContainer";
import { useAuthentication } from "@/providers/AuthenticationProvider";

const schema = z.object({
  email: z.string().email("Indtast en gyldig e-mailadresse").trim(),
  password: z
    .string()
    .min(1)
    .trim(),
});

export type LoginForm = z.infer<typeof schema>;

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const theme = useTheme();
  const { login } = useAuthentication();

  const onSubmit = (data: LoginForm) => {
    login(data).then(() => {
      router.navigate("/(tabs)");
    }
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
      <FormContainer>
        
        <Text variant="headlineLarge" style={{ fontWeight: "bold", marginBottom: 20, color: theme.colors.onSurface }}>Login</Text>
        <FormField name="email" control={control} placeholder="Enter your email" />
        <FormField name="password" control={control} placeholder="Enter your password" secureTextEntry />
        <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
          <Button mode="outlined" textColor={theme.colors.onSurface} disabled={!isValid} style={{ marginTop: 10 }} icon={"key"} onPress={handleSubmit(onSubmit)}>
            Login
          </Button>
          <Button mode="outlined" textColor={theme.colors.onSurface} style={{ marginTop: 5 }} icon={"account-plus"} onPress={() => router.push("/register")}>
            Register
          </Button>
        </View>
      </FormContainer>
    </SafeAreaView>
  );
};

export default LoginScreen;

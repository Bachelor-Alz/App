import React from "react";
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, useColorScheme } from "react-native";
import { createTheme } from "@/constants/CreateTheme";
import { PaperProvider } from "react-native-paper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormField from "@/components/forms/Formfield";
import SubmitButton from "@/components/forms/SubmitButton";
import FormContainer from "@/components/forms/FormContainer";

const schema = z
  .object({
    email: z.string().email("Indtast en gyldig e-mailadresse").trim(),
    name: z.string().trim().min(2, "Dit navn skal være mindst 2 bogstaver").trim(),
    password: z
      .string()
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/, {
        message: "Adgangskode skal indholde mindst 8 tegn, et stort bogstav, et lille bogstav og et tal",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Adgangskoderne stemmer ikke overens",
      });
    }
  });

export type RegisterForm = z.infer<typeof schema>;

const RegisterScreen = () => {
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === "dark");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid  },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: RegisterForm) => {
    console.log("Form submitted with data: ", data);
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <FormContainer>
          <Text style={[styles.header, { color: theme.colors.text }]}>Register</Text>

          <FormField
            control={control}
            name="name"
            placeholder="Name"
            errorStyle={styles.errorText}
            style={[
              styles.input,
              { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text },
            ]}
          />

          <FormField
            control={control}
            name="email"
            placeholder="Email"
            errorStyle={styles.errorText}
            style={[
              styles.input,
              { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text },
            ]}
          />

          <FormField
            control={control}
            name="password"
            placeholder="Password"
            secureTextEntry
            errorStyle={styles.errorText}
            style={[
              styles.input,
              { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text },
            ]}
          />

          <FormField
            control={control}
            name="confirmPassword"
            placeholder="Confirm Password"
            secureTextEntry
            errorStyle={styles.errorText}
            style={[
              styles.input,
              { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text },
            ]}
          />

          <SubmitButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit(onSubmit)}
            label="Register"
            />
        </FormContainer>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    padding: 25,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",  // Similar border color to LoginScreen
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
});

export default RegisterScreen;

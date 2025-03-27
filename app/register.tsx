import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, useColorScheme, TouchableOpacity } from "react-native";
import { createTheme } from "@/constants/CreateTheme";
import { PaperProvider, RadioButton } from "react-native-paper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import FormField from "@/components/forms/Formfield";
import SubmitButton from "@/components/forms/SubmitButton";
import FormContainer from "@/components/forms/FormContainer";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { router } from "expo-router";

const schema = z
  .object({
    email: z.string().email("Indtast en gyldig e-mailadresse").trim(),
    name: z.string().trim().min(2, "Dit navn skal være mindst 2 bogstaver").trim(),
    password: z
      .string()
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
        message: "Adgangskode skal indeholde mindst 8 tegn, et stort bogstav, et lille bogstav, et tal og et specialtegn",
      })
      .trim(),
    confirmPassword: z.string().trim(),
    role: z.union([z.literal(0), z.literal(1)]),
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
  const { register } = useAuthentication();
  const [userID, setUserID] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === "dark");

  const {
    control,
    getValues,
    formState: { isSubmitting, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleRegister = () => {
    const form = getValues();
    register(form).then(() => {
      setUserID(userID);
      router.navigate("/");
    });
  }

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
            style={[styles.input, { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text }]}
          />

          <FormField
            control={control}
            name="email"
            placeholder="Email"
            errorStyle={styles.errorText}
            style={[styles.input, { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text }]}
          />

          <FormField
            control={control}
            name="password"
            placeholder="Password"
            secureTextEntry
            errorStyle={styles.errorText}
            style={[styles.input, { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text }]}
          />

          <FormField
            control={control}
            name="confirmPassword"
            placeholder="Confirm Password"
            secureTextEntry
            errorStyle={styles.errorText}
            style={[styles.input, { backgroundColor: theme.dark ? "#333" : "#fff", color: theme.colors.text }]}
          />

          {/* Role Selection */}
          <Text style={[styles.radioLabel, { color: theme.colors.text }]}>Select Role:</Text>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <View style={styles.radioGroup}>
                {/* Caregiver Option */}
                <TouchableOpacity style={styles.radioItem} onPress={() => field.onChange(0)}>
                  <View style={[styles.radioCircle, { borderColor: field.value === 0 ? theme.colors.primary : "#888" }]}>
                    <RadioButton
                      value="0"
                      status={field.value === 0 ? "checked" : "unchecked"}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={[styles.radioText, { color: theme.colors.text }]}>Caregiver</Text>
                </TouchableOpacity>

                {/* Elder Option */}
                <TouchableOpacity style={styles.radioItem} onPress={() => field.onChange(1)}>
                  <View style={[styles.radioCircle, { borderColor: field.value === 1 ? theme.colors.primary : "#888" }]}>
                    <RadioButton
                      value="1"
                      status={field.value === 1 ? "checked" : "unchecked"}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={[styles.radioText, { color: theme.colors.text }]}>Elder</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <SubmitButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            handleSubmit={handleRegister}
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
    borderColor: "#555",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  radioGroup: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 15,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioText: {
    fontSize: 16,
  },
});

export default RegisterScreen;
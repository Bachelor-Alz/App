import React from "react";
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { PaperProvider, RadioButton, useTheme } from "react-native-paper";
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
  const theme = useTheme();

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
      router.navigate("/");
    });
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <FormContainer>
          <Text variant="headlineLarge">Register</Text>

          <FormField
            control={control}
            name="name"
            placeholder="Name"
          />

          <FormField
            control={control}
            name="email"
            placeholder="Email"
          />

          <FormField
            control={control}
            name="password"
            placeholder="Password"
            secureTextEntry
          />

          <FormField
            control={control}
            name="confirmPassword"
            placeholder="Confirm Password"
            secureTextEntry
          />

          {/* Role Selection */}
          <Text style={[styles.radioLabel]}>Select Role:</Text>
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
                    />
                  </View>
                  <Text style={styles.radioText}>Caregiver</Text>
                </TouchableOpacity>

                {/* Elder Option */}
                <TouchableOpacity style={styles.radioItem} onPress={() => field.onChange(1)}>
                  <View style={[styles.radioCircle, { borderColor: field.value === 1 ? theme.colors.primary : "#888" }]}>
                    <RadioButton
                      value="1"
                      status={field.value === 1 ? "checked" : "unchecked"}
                    />
                  </View>
                  <Text style={styles.radioText}>Elder</Text>
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
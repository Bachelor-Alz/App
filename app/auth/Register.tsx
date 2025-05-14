import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, RadioButton, useTheme, Button } from "react-native-paper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import FormField from "@/components/forms/Formfield";
import SubmitButton from "@/components/forms/SubmitButton";
import FormContainer from "@/components/forms/FormContainer";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import useLocationResolver from "@/hooks/useLocationResolver";
import { useDebounce } from "@uidotdev/usehooks";
import SmartAreaView from "@/components/SmartAreaView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/navigation";

const baseFields = {
  email: z.string().email("Must be a valid email address").trim(),
  name: z.string().min(2, "Name must be at least 2 characters long").trim(),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
      message:
        "The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    })
    .trim(),
  confirmPassword: z.string().trim(),
};

const caregiverSchema = z.object({
  role: z.literal(0),
  ...baseFields,
});

const elderSchema = z.object({
  role: z.literal(1),
  ...baseFields,
  address: z
    .string()
    .trim()
    .refine(
      (val) => /^(?:[A-Za-zæøåÆØÅ\s]+,\s?)?[A-Za-zæøåÆØÅ\s]+\s\d{1,5}(?:\s[A-Za-zæøåÆØÅ\s]+)?$/.test(val),
      { message: "The address is not valid" }
    ),
  latitude: z.number(),
  longitude: z.number(),
});

const schema = z.discriminatedUnion("role", [caregiverSchema, elderSchema]).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "The passwords do not match",
    });
  }
});

export type RegisterForm = z.infer<typeof schema>;
type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  const { register } = useAuthentication();
  const theme = useTheme();

  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { isSubmitting, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { role: 1 },
  });

  const role = useWatch({ control, name: "role" });
  const address = useWatch({ control, name: "address" });
  const isElder = role === 1;

  const debouncedAddress = useDebounce(address, 500);

  const { data: suggestions } = useLocationResolver(debouncedAddress, isElder);

  const handleRegister = () => {
    const form = getValues();
    register(form).then(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    });
  };

  return (
    <SmartAreaView>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <FormContainer>
          <Text variant="headlineLarge">Register</Text>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <View style={styles.radioGroup}>
                {[
                  { label: "Caregiver", value: 0 },
                  { label: "Elder", value: 1 },
                ].map(({ label, value }) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.radioItem}
                    onPress={() => field.onChange(value)}>
                    <View
                      style={[
                        styles.radioCircle,
                        { borderColor: field.value === value ? theme.colors.primary : "#888" },
                      ]}>
                      <RadioButton
                        value={String(value)}
                        status={field.value === value ? "checked" : "unchecked"}
                      />
                    </View>
                    <Text style={styles.radioText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />

          <FormField control={control} name="name" placeholder="Name" />
          <FormField control={control} name="email" placeholder="Email" />
          <FormField control={control} name="password" placeholder="Password" secureTextEntry />
          <FormField
            control={control}
            name="confirmPassword"
            placeholder="Confirm Password"
            secureTextEntry
          />

          {isElder && (
            <>
              <FormField control={control} name="address" placeholder="Address (Visionsvej 21 Aalborg)" />
              {suggestions?.map((item, index) => (
                <Button
                  key={index}
                  mode="outlined"
                  labelStyle={styles.buttonLabel}
                  onPress={() => {
                    setValue("address", item.fullAddress);
                    setValue("latitude", Number(item.lat));
                    setValue("longitude", Number(item.lon));
                    trigger("address");
                  }}>
                  {item.fullAddress}
                </Button>
              ))}
            </>
          )}

          <SubmitButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            handleSubmit={handleRegister}
            label="Register"
          />
        </FormContainer>
      </View>
    </SmartAreaView>
  );
};

const styles = StyleSheet.create({
  radioGroup: {
    flexDirection: "row",
    gap: 30,
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
  buttonLabel: {
    color: "#333",
    fontWeight: "600",
    fontSize: 12,
  },
});

export default RegisterScreen;

import React from "react";
import { Alert, View } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/forms/Formfield";
import FormContainer from "@/components/forms/FormContainer";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { assignCaregiverToElder } from "@/apis/elderAPI";
import SmartAreaView from "@/components/SmartAreaView";
import { router } from "expo-router";

const schema = z.object({
  caregiverEmail: z.string().email("Please enter a valid email address").trim(),
});

type AssignCaregiverForm = z.infer<typeof schema>;

const AssignCaregiverScreen = () => {
  const theme = useTheme();
  const { userEmail } = useAuthentication();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<AssignCaregiverForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async ({ caregiverEmail }: AssignCaregiverForm) => {
    if (!userEmail) {
      Alert.alert("Error", "No elder is logged in.");
      return;
    }

    try {
      await assignCaregiverToElder(userEmail, caregiverEmail);
      Alert.alert("Success", `Caregiver assigned to ${userEmail}`, [
        {
          text: "OK",
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to assign caregiver.");
    }
  };

  return (
    <SmartAreaView>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <FormContainer>
          <Text
            variant="headlineLarge"
            style={{ fontWeight: "bold", marginBottom: 20, color: theme.colors.onSurface }}>
            Assign Caregiver
          </Text>

          <FormField name="caregiverEmail" control={control} placeholder="Enter caregiver email" />

          <Button
            mode="outlined"
            textColor={theme.colors.onSurface}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            icon="account-arrow-right"
            style={{ marginTop: 10 }}>
            Assign
          </Button>
        </FormContainer>
      </View>
    </SmartAreaView>
  );
};

export default AssignCaregiverScreen;

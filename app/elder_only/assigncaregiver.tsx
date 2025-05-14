import React from "react";
import { Alert, View } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/forms/Formfield";
import FormContainer from "@/components/forms/FormContainer";
import { assignCaregiverToElder } from "@/apis/elderAPI";
import SmartAreaView from "@/components/SmartAreaView";
import { ElderTabParamList } from "../navigation/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const schema = z.object({
  caregiverEmail: z.string().email("Please enter a valid email address").trim(),
});

type AssignCaregiverForm = z.infer<typeof schema>;
type Props = NativeStackScreenProps<ElderTabParamList, "AssignCaregiver">;
const AssignCaregiverScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<AssignCaregiverForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async ({ caregiverEmail }: AssignCaregiverForm) => {
    try {
      await assignCaregiverToElder(caregiverEmail);
      reset();
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Error", "Failed to assign caregiver. " + errorMessage);
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

import React from "react";
import { TextStyle, useColorScheme, View } from "react-native";
import { Control, Controller, FieldPath, FieldValues, useFormState } from "react-hook-form";
import { createTheme } from "@/constants/CreateTheme";
import { TextInput, Text, TextInputProps, useTheme } from "react-native-paper";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  errorStyle?: TextStyle;
} & TextInputProps;

const FormField = <T extends FieldValues>({
  control,
  name,
  errorStyle,
  ...inputProps
}: FormFieldProps<T>) => {
  const { errors } = useFormState({ control });
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={{ width: "100%", gap: 5 }}>
          <TextInput
            value={value}
            onChangeText={onChange}
            mode="outlined"
            style={inputProps.style}
            error={!!errors[name]}
            selectionColor={theme.colors.onSurface as string}
            placeholderTextColor={theme.colors.onSurface as string}
            {...inputProps}
          />
          {errors[name] && (
            <Text style={[errorStyle]}>
              {typeof errors[name]?.message === "string" ? errors[name]?.message : ""}
            </Text>
          )}
        </View>
      )}
    />
  );
};

export default FormField;

import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, useColorScheme, View } from "react-native";
import { Control, Controller, FieldPath, FieldValues, useFormState } from "react-hook-form";
import { createTheme } from "@/constants/CreateTheme";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  errorStyle?: TextStyle;
} & TextInputProps;

const FormField = <T extends FieldValues>({ control, name, errorStyle, ...inputProps }: FormFieldProps<T>) => {
  const { errors } = useFormState({ control });
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === "dark");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            value={value}
            onChangeText={onChange}
            style={[
              styles.inputBase,
              errors[name] ? { borderColor: theme.colors.error } : { borderColor: theme.colors.outline },
              inputProps.style,  // Ensure this is merged correctly with default styles
            ]}
            {...inputProps}
          />
          {errors[name] && (
            <Text style={[styles.errorText, errorStyle]}>
              {typeof errors[name]?.message === "string" ? errors[name]?.message : ""}
            </Text>
          )}
        </View>
      )}
    />
  );
};


const styles = StyleSheet.create({
  inputBase: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 5,
  }
});

export default FormField;
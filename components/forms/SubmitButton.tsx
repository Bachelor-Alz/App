import { StyleProp, Text, TouchableOpacity, useColorScheme, ViewStyle, StyleSheet } from "react-native";
import { createTheme } from "@/constants/CreateTheme";

type SubmitButtonProps = {
  isValid: boolean;
  isSubmitting: boolean;
  handleSubmit: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
};
const colorScheme = useColorScheme();
const theme = createTheme(colorScheme === "dark");


const SubmitButton = ({ isValid, isSubmitting, handleSubmit, label, style }: SubmitButtonProps) => {
  return (
    <TouchableOpacity
      style={[isValid ? styles.submitButton : styles.buttonDisabled, style]}
      disabled={!isValid || isSubmitting}
      onPress={handleSubmit}>
      <Text style={styles.buttonText}>{isSubmitting ? "..." : label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    buttonDisabled: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: theme.colors.surfaceDisabled,
    },
    submitButton: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: theme.colors.primary,
    },
});

export default SubmitButton;


import { StyleProp, Text, TouchableOpacity, useColorScheme, ViewStyle, StyleSheet } from "react-native";
import { createTheme } from "@/constants/CreateTheme";
import { useTheme } from "react-native-paper";

type SubmitButtonProps = {
  isValid: boolean;
  isSubmitting: boolean;
  handleSubmit: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
};

const SubmitButton = ({ isValid, isSubmitting, handleSubmit, label, style }: SubmitButtonProps) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        isValid
          ? { backgroundColor: theme.colors.primary }
          : { backgroundColor: theme.colors.surfaceDisabled },
        style,
      ]}
      disabled={!isValid || isSubmitting}
      onPress={handleSubmit}>
      <Text style={styles.buttonText}>{isSubmitting ? "..." : label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SubmitButton;

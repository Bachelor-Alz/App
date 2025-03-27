import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type FormContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const FormContainer = ({ children, style }: FormContainerProps) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default FormContainer;

const styles = StyleSheet.create({
container: {
    width: "85%",
    padding: 25,
    gap: 15,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
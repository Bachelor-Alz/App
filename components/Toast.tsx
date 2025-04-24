import { View, StyleSheet } from "react-native";
import { Button, Icon, MD3Theme, Text } from "react-native-paper";
import Animated, { FadeInUp, FadeOutRight, LinearTransition } from "react-native-reanimated";

export type ToastType = "success" | "error";

type ToastProps = {
  title: string;
  message: string;
  onClose?: () => void;
  type: ToastType;
  theme: MD3Theme;
};

const Toast = ({ title, message, onClose, type, theme }: ToastProps) => {
  const color = type === "success" ? theme.colors.primary : theme.colors.error;
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeInUp}
      exiting={FadeOutRight}
      style={[styles.toastContainer, { borderLeftColor: color }]}>
      <View>
        <Text style={styles.toastTitle}>{title}</Text>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
      <Button onPress={onClose}>
        <Icon size={25} source="close" />
      </Button>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
    padding: 15,
    paddingRight: 0,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  toastTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  toastMessage: {
    fontSize: 16,
  },
});

export default Toast;

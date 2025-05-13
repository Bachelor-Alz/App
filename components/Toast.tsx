import { View, StyleSheet } from "react-native";
import { Button, Icon, MD3Theme, Text } from "react-native-paper";
import Animated, { FadeInUp, FadeOutRight, LinearTransition } from "react-native-reanimated";

type ToastProps = {
  title: string;
  message: string;
  onClose?: () => void;
  theme: MD3Theme;
};

const Toast = ({ title, message, onClose, theme }: ToastProps) => {
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeInUp}
      exiting={FadeOutRight}
      style={[
        styles.toastContainer,
        { borderLeftColor: theme.colors.error, backgroundColor: theme.colors.elevation.level1 },
      ]}>
      <View>
        <Text variant="titleLarge" style={styles.toastTitle}>
          {title}
        </Text>
        <Text variant="titleMedium">{message}</Text>
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
    borderRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  toastTitle: {
    fontWeight: "bold",
  },
});

export default Toast;

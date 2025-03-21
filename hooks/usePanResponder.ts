import { useRef } from "react";
import { Animated, PanResponder, GestureResponderEvent, PanResponderGestureState, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const usePanResponder = (chartWidth: number) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const newPos = clamp(currentOffset.current + gestureState.dx, screenWidth - chartWidth, 0);
        translateX.setValue(newPos);
      },
      onPanResponderRelease: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        let newOffset = currentOffset.current + gestureState.dx;
        newOffset = clamp(newOffset, screenWidth - chartWidth, 0);
        currentOffset.current = newOffset;
        Animated.spring(translateX, {
          toValue: newOffset,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return { translateX, panResponder };
};

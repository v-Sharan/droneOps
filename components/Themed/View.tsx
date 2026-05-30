// CustomView.tsx

import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import React from "react";
import { Animated } from "react-native";

const View: React.FC<React.ComponentProps<typeof Animated.View>> = ({
  children,
  style,
  ...rest
}) => {

  const {colors} = useAnimatedTheme();

  return (
    <Animated.View style={[{ backgroundColor:colors.surface }, style]} {...rest}>
      {children}
    </Animated.View>
  );
};

export default View;

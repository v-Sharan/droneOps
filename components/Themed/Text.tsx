// CustomView.tsx

import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import React from "react";
import { Animated } from "react-native";



const Text: React.FC<React.ComponentProps<typeof Animated.Text>> = ({
  style,
  children,
  ...rest
}) => {
  const {colors} = useAnimatedTheme();
  
  return (
    <Animated.Text style={[{ color: colors.text }, style]} {...rest}>
      {children}
    </Animated.Text>
  );
};

export default Text;

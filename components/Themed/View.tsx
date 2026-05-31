import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import React from "react";
import { Animated } from "react-native";

interface ViewProps extends React.ComponentProps<typeof Animated.View> {
  backgroundColor?: Animated.AnimatedInterpolation<string | number>;
}

const View: React.FC<ViewProps> = ({
  children,
  style,
  backgroundColor,
  ...rest
}) => {

  const {colors} = useAnimatedTheme();

  return (
      <Animated.View style={[{ backgroundColor: backgroundColor || colors.background }, style]} {...rest}>
      {children}
    </Animated.View>
  );
};

export default View;

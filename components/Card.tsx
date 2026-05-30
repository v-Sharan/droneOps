import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { View } from "./Themed";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}

const Card = ({ children, style, elevated }: CardProps) => {
  const { colors, radii, Shadow } = useAnimatedTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: 0.5,
          borderColor: colors.border,
          padding: 16,
        },
        elevated && Shadow.md,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;

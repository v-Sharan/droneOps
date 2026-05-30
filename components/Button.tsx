import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import { useTheme } from "@/providers/ThemeContextProvider";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
import { Text, View } from "./Themed";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const Button  = ({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
  fullWidth = true,
}: ButtonProps) => {
  const { colors } = useAnimatedTheme();
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const bgMap: Record<
    Variant,
    Animated.AnimatedInterpolation<string | number>
  > = {
    primary: colors.primary,
    secondary: colors.border,
    danger: colors.error,
  };
  const textMap: Record<Variant, Animated.AnimatedInterpolation<string | number>> = {
    primary: colors.text,
    secondary: colors.textSecondary,
    danger: colors.surface,
  };

  const Loader = {
    primary: <ActivityIndicator color={theme.colors.onPrimary} size="small" />,
    secondary: <ActivityIndicator color={theme.colors.text} size="small" />,
    danger: <ActivityIndicator color={theme.colors.surface} size="small" />,
  }

  return (
    <View
      style={{
        backgroundColor: bgMap[variant],
        opacity: isDisabled ? 0.55 : 1,
        width: fullWidth ? "100%" : undefined,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[
          styles.base,
          fullWidth && { width: "100%" },
          style,
          { borderRadius: theme.radii.md },
        ]}
      >
        {loading ? (
          Loader[variant]
        ) : (
          <Text style={[styles.label, { color: textMap[variant] }]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: { fontSize: 15, fontWeight: "600", letterSpacing: 0.2 },
});

export default Button;
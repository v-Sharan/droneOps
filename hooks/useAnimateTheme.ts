// src/theme/useAnimatedTheme.ts
import { useMemo } from "react";
import { darkTheme, lightTheme } from "../constants/theme";
import { useTheme } from "../providers/ThemeContextProvider";
import { themeColors } from "../types/theme.types";

type ColorKey = themeColors["colors"] extends Record<infer K, any> ? K : never;

export function useAnimatedColor(key: ColorKey) {
  const { animProgress } = useTheme();
  return useMemo(
    () =>
      animProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [lightTheme.colors[key], darkTheme.colors[key]],
      }),
    [key], // animProgress is stable (useRef)
  );
}

export function useAnimatedTheme() {
  const { animProgress, theme, mode, setMode, resolved } = useTheme();

  const colors = useMemo(() => {
    const interp = (key: ColorKey) =>
      animProgress.interpolate({
        inputRange: [0, 1],

        outputRange: [lightTheme.colors[key], darkTheme.colors[key]],
      });

    return {
      background: interp("background"),
      surface: interp("surface"),
      surfaceRaised: interp("surfaceRaised"),
      primary: interp("primary"),
      text: interp("text"),
      textSecondary: interp("textSecondary"),
      border: interp("border"),
      success: interp("success"),
      successBg: interp("successBg"),
      error: interp("error"),
      warning: interp("warning"),
      warningBg: interp("warningBg"),
      textSoft: interp("textSoft"),
    };
  }, []);
  // stable — animProgress never changes

  return {
    colors,
    spacing: theme.spacing,
    radii: theme.radii,
    typography: theme.typography,
    mode,
    setMode,
    resolved,
    Shadow: theme.Shadow,
  };
}

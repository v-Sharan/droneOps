import { TextStyle } from "react-native";

export type themeColors = {
  colors: {
    background: string;
    surface: string;
    surfaceRaised: string;
    primary: string;
    onPrimary: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    successBg: string;
    error: string;
    warning: string;
    warningBg: string;
    textSoft: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
  Shadow: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  isDark: boolean;
};

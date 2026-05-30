import { themeColors } from "@/types/theme.types";

export const lightTheme: themeColors = {
  colors: {
    background: "#FFFFFF",
    surface: "#F5F5F5",
    surfaceRaised: "#EFEFEF",
    primary: "#47ff50",
    onPrimary: "#FFFFFF",
    text: "#111827",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    successBg: "#D1FAE5",
    error: "#EF4444",
    warning: "#F59E0B",
    warningBg: "#FEF3C7",
    textSoft: "#9CA3AF",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: "700", lineHeight: 36 },
    h2: { fontSize: 22, fontWeight: "600", lineHeight: 30 },
    body: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
    caption: { fontSize: 12, fontWeight: "400", lineHeight: 16 },
  },
  Shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  isDark: false,
} as const;

export const darkTheme: themeColors = {
  colors: {
    background: "#0F172A",
    surface: "#1E293B",
    surfaceRaised: "#2D3F55",
    primary: "#818CF8",
    onPrimary: "#1E1B4B",
    text: "#F9FAFB",
    textSecondary: "#9CA3AF",
    border: "#374151",
    success: "#34D399",
    successBg: "#064E3B",
    error: "#F87171",
    warning: "#FCD34D",
    warningBg: "#2D1F03",
    textSoft: "#6B7280",
  },
  spacing: lightTheme.spacing,
  radii: lightTheme.radii,
  typography: lightTheme.typography,
  Shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  isDark: true,
};

export type Theme = typeof lightTheme;

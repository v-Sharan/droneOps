import { DefaultTheme, DarkTheme as NavigationDarkTheme } from "expo-router";

import { Theme } from "expo-router/build/react-navigation";

export interface MyTheme extends Theme {
  colors: Theme["colors"] & {
    secondary: string;
    surface: string;
    surfaceLight: string;
    tabBarInactive: string;
  };
}

const DarkTheme: MyTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: "#4ADE80",
    secondary: "#2DD4BF",
    background: "#181818",
    text: "#F5E7D2",
    surface: "#1A1A1A",
    surfaceLight: "#7B7B7B",
    tabBarInactive: "rgba(90, 140, 109, 0.15)",
  },
};

const LightTheme: MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#23BA5B",
    secondary: "#2DD4BF",
    background: "rgb(242, 242, 242)",
    surface: "rgb(182, 178, 178)",
    surfaceLight: "#9FA3AF",
    tabBarInactive: "rgba(90, 140, 109, 0.15)",
  },
};

export { DarkTheme, LightTheme };

// import type { TextStyle } from 'react-native';

// export const lightTheme = {
//   colors: {
//     background:    '#FFFFFF',
//     surface:       '#F5F5F5',
//     surfaceRaised: '#EFEFEF',
//     primary:       '#6366F1',
//     onPrimary:     '#FFFFFF',
//     text:          '#111827',
//     textSecondary: '#6B7280',
//     border:        '#E5E7EB',
//     success:       '#10B981',
//     error:         '#EF4444',
//     warning:       '#F59E0B',
//   },
//   spacing: {
//     xs: 4,  sm: 8,  md: 16,
//     lg: 24, xl: 32, xxl: 48,
//   },
//   radii: {
//     sm: 4, md: 8, lg: 16,
//     xl: 24, full: 9999,
//   },
//   typography: {
//     h1: { fontSize: 28, fontWeight: '700', lineHeight: 36 } as TextStyle,
//     h2: { fontSize: 22, fontWeight: '600', lineHeight: 30 } as TextStyle,
//     body: { fontSize: 16, fontWeight: '400', lineHeight: 24 } as TextStyle,
//     caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 } as TextStyle,
//   },
//   isDark: false,
// } as const;

// export const darkTheme: typeof lightTheme = {
//   colors: {
//     background:    '#0F172A',
//     surface:       '#1E293B',
//     surfaceRaised: '#2D3F55',
//     primary:       '#818CF8',
//     onPrimary:     '#1E1B4B',
//     text:          '#F9FAFB',
//     textSecondary: '#9CA3AF',
//     border:        '#374151',
//     success:       '#34D399',
//     error:         '#F87171',
//     warning:       '#FCD34D',
//   },
//   spacing:    lightTheme.spacing,
//   radii:      lightTheme.radii,
//   typography: lightTheme.typography,
//   isDark: true,
// };

// export type Theme = typeof lightTheme;

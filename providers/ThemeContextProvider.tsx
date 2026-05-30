import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { Animated, useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from '../constants/theme';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeCtx {
  theme:        Theme;
  mode:         ThemeMode;
  setMode:      (m: ThemeMode) => void;
  resolved:     'light' | 'dark';
  animProgress: Animated.Value;   // 0 = light, 1 = dark
  duration:     number;           // ms, configurable

}

const STORAGE_KEY = '@app/themeMode';
const ThemeContext = createContext<ThemeCtx>(null!);

export function ThemeProvider({
  children,
  duration = 350,       // default animation length
}: {
  children: React.ReactNode;
  duration?: number;
}) {
  const systemScheme = useColorScheme();
  const [mode, setModeState]   = useState<ThemeMode>('system');
  const [hydrated, setHydrated] = useState(false);

  // Shared animated value — starts at 0 (light)

  const animProgress = useRef(new Animated.Value(0)).current;


  // Hydrate from storage
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v => {
      if (v === 'light' || v === 'dark' || v === 'system')
        setModeState(v);
      setHydrated(true);
    });
  }, []);

  // Resolve current scheme
  const resolved: 'light' | 'dark' = mode === 'system'
    ? (systemScheme === 'dark' ? 'dark' : 'light')
    : mode;

  // Animate whenever resolved changes

  useEffect(() => {

    Animated.timing(animProgress, {
      toValue:         resolved === 'dark' ? 1 : 0,
      duration,
      useNativeDriver: false,  // colors can't use native driver
    }).start();

  }, [resolved, duration]);


  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m);
  }, []);

  const theme = resolved === 'dark' ? darkTheme : lightTheme;

  if (!hydrated) return null;

  return (
    <ThemeContext.Provider
      value={{ theme, mode, setMode, resolved, animProgress, duration }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme    = () => useContext(ThemeContext);
export const useIsDark    = () => useContext(ThemeContext).resolved === 'dark';
export const useThemeMode = () => useContext(ThemeContext).mode;
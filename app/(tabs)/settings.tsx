import { View } from '@/components/Themed';
import { useAnimatedTheme } from '@/hooks/useAnimateTheme';
import { useTheme } from '@/providers/ThemeContextProvider';
import { Animated, Pressable } from 'react-native';

const MODES = [
  { label: 'System', value: 'system' as const },
  { label: 'Light',  value: 'light'  as const },
  { label: 'Dark',   value: 'dark'   as const },
];

export default function SettingsScreen() {
  const { colors, spacing, radii, mode, setMode, resolved }
    = useAnimatedTheme();
    const {theme} = useTheme();

  return (
    <Animated.ScrollView style={{ flex: 1, backgroundColor: colors.background }}>

      <View style={{ padding: spacing.lg }}>

        <Animated.Text style={{
          fontSize: 22, fontWeight: '700',
          color: colors.text, marginBottom: spacing.md,

        }}>
          Appearance
        </Animated.Text>

        <View style={{
          flexDirection: 'row', gap: spacing.sm,
          marginBottom: spacing.xl,
        }}>
          {MODES.map(opt => {
            const isActive = mode === opt.value;
            return (
              <View
                key={opt.value}
                style={{
                  flex: 1, borderRadius: radii.md,
                  borderWidth: 1,
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: isActive ? theme.colors.primary : colors.border,
                }}
              >
                <Pressable
                  onPress={() => setMode(opt.value)}
                  style={{ padding: spacing.sm, alignItems: 'center' }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isActive }}
                >
                  <Animated.Text style={{
                    color: isActive ? theme.colors.onPrimary : theme.colors.textSecondary,
                  }}>
                    {opt.label}
                  </Animated.Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={{
          borderRadius: radii.lg, padding: spacing.md,
          borderWidth: 1,
        }}>
          {[
            ['mode',     mode],
            ['resolved', resolved],
            ['isDark',   String(resolved === 'dark')],
          ].map(([k, v]) => (
            <View key={k} style={{
              flexDirection: 'row', 
              justifyContent: 'space-between',
              paddingVertical: 6,
              borderBottomWidth: 0.5,
            }}>
              <Animated.Text style={{ color: colors.textSecondary }}>{k}</Animated.Text>
              <Animated.Text style={{ color: colors.text }}>{v}</Animated.Text>
            </View>
          ))}
        </View>

      </View>
    </Animated.ScrollView>
  );
}
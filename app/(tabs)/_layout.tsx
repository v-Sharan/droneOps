import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import { useTheme } from "@/providers/ThemeContextProvider";
import { useAuth } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs, useRouter } from "expo-router";
import { Animated } from "react-native";

const TabsLayout = () => {
  const { isSignedIn } = useAuth();
  const { theme } = useTheme();
  const { colors } = useAnimatedTheme();

  const {} = useRouter();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarBackground: () => (
          <Animated.View style={{
            flex: 1,
            backgroundColor: colors.surface,
          }} />
        ),
        tabBarStyle: {
          borderTopColor: theme.colors.border,
          borderTopWidth: 0.5,
        },
        headerBackground: () => (
          <Animated.View style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderBottomWidth: 0.5,
            borderBottomColor: theme.colors.border,
          }} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="worksheet"
        options={{
          title: "Worksheet",
          tabBarIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

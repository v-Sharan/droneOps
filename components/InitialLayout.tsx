import { useTheme } from "@/providers/ThemeContextProvider";
import { useAuth } from "@clerk/expo";
import { useConvexAuth } from "convex/react";
import {
  SplashScreen,
  Stack,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { resolved, theme } = useTheme();
  const { isAuthenticated } = useConvexAuth();

  const segments = useSegments();
  const router = useRouter();


  useEffect(() => {
    if (!isLoaded) return;

    const isAuthScreen = segments[0] == "(auth)";

    if (!isSignedIn && !isAuthScreen && !isAuthenticated) router.replace("/(auth)/login");
    else if (isSignedIn && isAuthScreen && isAuthenticated) router.replace("/(tabs)");
  }, [segments, isLoaded, isSignedIn,isAuthenticated]);

  const onLayoutRootView = useCallback(async () => {
    if (isLoaded) await SplashScreen.hideAsync();
  }, [isLoaded, isSignedIn]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1,backgroundColor: theme.colors.background }} onLayout={onLayoutRootView}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar animated style={resolved == "dark" ? "light" : "dark"} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default InitialLayout;

import React, { useEffect } from "react";
import { ErrorBoundary, Stack } from "expo-router";
import { Try } from "expo-router/build/views/Try";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ReactQueryProvider } from "src";

// Prevent auto-hiding and hide splash screen immediately
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Try catch={ErrorBoundary}>
      <SafeAreaProvider>
        <ReactQueryProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(logged-in)" />
          </Stack>

          {/* Toast component for notifications */}
          <Toast position="bottom" />
        </ReactQueryProvider>
      </SafeAreaProvider>
    </Try>
  );
}

export default RootLayout;

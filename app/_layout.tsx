import * as SplashScreen from "expo-splash-screen";

import { ErrorBoundary, Stack } from "expo-router";
import React, { useEffect } from "react";

import { ReactQueryProvider } from "src";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Try } from "expo-router/build/views/Try";

// prevent auto hide and hide immediately - kinda redundant but works
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

          {/* toast for global notifications */}
          <Toast position="bottom" />
        </ReactQueryProvider>
      </SafeAreaProvider>
    </Try>
  );
}

export default RootLayout;

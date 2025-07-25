import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "src";

export default function LoggedInLayout() {
  const { creds } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!creds?.jwtToken) {
      router.replace("/(auth)/login");
    }
  }, [creds, router]);

  if (!creds?.jwtToken) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
    </Stack>
  );
}

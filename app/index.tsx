import React from "react";
import { Redirect } from "expo-router";
import { LoadingSpinner } from "@components/atoms";
import { useAuthStore } from "src";

export default function IndexScreen() {
  const { creds, loading } = useAuthStore();

  // Show loading while auth state is being determined
  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  // Redirect based on auth state
  if (creds?.jwtToken) {
    return <Redirect href="/(logged-in)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}

import { LoadingSpinner } from "@components/atoms";
import React from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "src";

// main entry point - redirects based on auth status
export default function IndexScreen() {
  const { creds, loading } = useAuthStore();

  // show loading while figuring out auth state
  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  // redirect to home if logged in, otherwise login
  if (creds?.jwtToken) {
    return <Redirect href="/(logged-in)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}

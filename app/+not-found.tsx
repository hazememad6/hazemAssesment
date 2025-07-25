import React from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../src/store";

export default function NotFoundScreen() {
  const { creds } = useAuthStore();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen does not exist.</Text>

        <Link href={creds?.jwtToken ? "/(logged-in)/home" : "/(auth)/login"} style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});

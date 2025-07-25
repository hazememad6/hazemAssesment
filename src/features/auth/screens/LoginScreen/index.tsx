import { Button, LoadingSpinner } from "../../../../components";
import { ScrollView, Text, View } from "react-native";

import { InputFormController } from "@components/molecules";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { regex } from "@utils/regex";
import { useAuthFeature } from "./hooks/useAuth";
import { useLoginScreenStyles } from "./styles";

/**
 * LoginScreen - The gateway to our app
 *
 * This screen went through several design iterations:
 * - First version was just basic email/password fields
 * - Added form validation with react-hook-form (much cleaner than manual state)
 * - Integrated biometric authentication when we realized it's a must-have for mobile
 * - Added demo credentials display (users kept asking what to enter)
 * - ScrollView was added when we noticed keyboard was covering inputs on smaller devices
 *
 * The biometric feature only works on actual devices, not in Expo Go.
 * Had to learn this the hard way during testing!
 */
export const LoginScreen: React.FC = () => {
  const { control, authState, handleLogin, handleBiometricLogin } = useAuthFeature();
  const styles = useLoginScreenStyles();

  // Debug logging - useful when debugging auth flows
  // if (__DEV__) {
  //   console.log('LoginScreen render:', {
  //     loading: authState.loading,
  //     biometricAvailable: authState.biometricAvailable
  //   });
  // }

  // Show loading screen during authentication
  // Originally had a spinner overlay but full screen is cleaner
  if (authState.loading) {
    return <LoadingSpinner text="Logging in..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView prevents keyboard from covering inputs on smaller screens */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false} // Cleaner look
      >
        {/* Welcome section - first impression matters */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to manage your tasks</Text>
        </View>

        {/* Main form section */}
        <View style={styles.formContainer}>
          {/* Email input with validation */}
          <InputFormController
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: regex.regEmail,
                message: "Please enter a valid email",
              },
            }}
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password input with minimum length validation */}
          <InputFormController
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
          />

          {/* Primary sign in button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={authState.loading}
              disabled={authState.loading}
              testID="sign-in-button"
            />
          </View>

          {/* Biometric authentication option - only show if available */}
          {/* This feature was a game-changer for user experience */}
          {authState.biometricAvailable && (
            <View style={styles.buttonContainer}>
              <Button
                title="Sign In with Biometrics"
                onPress={handleBiometricLogin}
                variant="outline"
                disabled={authState.loading}
                icon="finger-print-outline" // Visual cue for biometric
                testID="biometric-sign-in-button"
              />
            </View>
          )}
        </View>

        {/* Demo credentials section - users always ask what to enter */}
        {/* Originally this was hidden but decided to make it prominent */}
        <View style={styles.credentialsContainer}>
          <Text style={styles.credentialsTitle}>Demo Credentials:</Text>
          <Text style={styles.credentialsText}>Email: demo@example.com{"\n"}Password: password123</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

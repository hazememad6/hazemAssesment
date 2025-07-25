import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputFormController } from "@components/molecules";
import { regex } from "@utils/regex";
import { Button, LoadingSpinner } from "../../../../components";
import { useAuthFeature } from "./hooks/useAuth";
import { useLoginScreenStyles } from "./styles";

export const LoginScreen: React.FC = () => {
  const { control, authState, handleLogin, handleBiometricLogin } = useAuthFeature();
  const styles = useLoginScreenStyles();

  if (authState.loading) {
    return <LoadingSpinner text="Logging in..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to manage your tasks</Text>
        </View>

        <View style={styles.formContainer}>
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

          {/* Main Sign In Button */}
          <View style={styles.buttonContainer}>
            <Button title="Sign In" onPress={handleLogin} loading={authState.loading} disabled={authState.loading} />
          </View>

          {/* Biometric Sign In Button with proper spacing */}
          {authState.biometricAvailable && (
            <View style={styles.buttonContainer}>
              <Button
                title="Sign In with Biometrics"
                onPress={handleBiometricLogin}
                variant="outline"
                disabled={authState.loading}
              />
            </View>
          )}
        </View>

        <View style={styles.credentialsContainer}>
          <Text style={styles.credentialsTitle}>Demo Credentials:</Text>
          <Text style={styles.credentialsText}>Email: demo@example.com{"\n"}Password: password123</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

import { useCallback, useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@store/authStore";
// regex validation now handled in LoginScreen component

export interface LoginFormData {
  email: string;
  password: string;
}

interface AuthState {
  loading: boolean;
  biometricAvailable: boolean;
}

const DEMO_CREDENTIALS = {
  email: "demo@example.com",
  password: "password123",
};

export const useAuthFeature = () => {
  const { login, creds } = useAuthStore();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    },
  });

  const [authState, setAuthState] = useState<AuthState>({
    loading: false,
    biometricAvailable: false,
  });

  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState((prev: AuthState) => ({ ...prev, ...updates }));
  }, []);

  const checkBiometricSupport = useCallback(async () => {
    try {
      console.log("🔐 Checking biometric support...");
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      console.log("🔐 Biometric check results:", {
        hasHardware,
        isEnrolled,
        supportedTypes: supportedTypes.map((type) => LocalAuthentication.AuthenticationType[type]),
      });

      const biometricAvailable = hasHardware && isEnrolled;
      updateAuthState({ biometricAvailable });

      if (biometricAvailable) {
        Toast.show({
          type: "info",
          text1: "Biometric Login Available",
          text2: "You can use your fingerprint or face ID",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.log("🔐 Biometric check error:", error);
    }
  }, [updateAuthState]);

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      updateAuthState({ loading: true });

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (data.email === DEMO_CREDENTIALS.email && data.password === DEMO_CREDENTIALS.password) {
          const mockToken = "mock-jwt-token-" + Date.now();
          login({ jwtToken: mockToken });

          Toast.show({
            type: "success",
            text1: "Login Successful",
            text2: "Welcome back!",
            visibilityTime: 2000,
          });

          router.replace("/(logged-in)/home");
        } else {
          Alert.alert(
            "Login Failed",
            "Invalid credentials. Please use:\nEmail: demo@example.com\nPassword: password123"
          );
        }
      } catch {
        Alert.alert("Error", "An error occurred during login. Please try again.");
      } finally {
        updateAuthState({ loading: false });
      }
    },
    [login, router, updateAuthState]
  );

  const handleBiometricLogin = useCallback(async () => {
    try {
      console.log("🔐 Starting biometric authentication...");

      Toast.show({
        type: "info",
        text1: "Biometric Authentication",
        text2: "Please authenticate to continue",
        visibilityTime: 2000,
      });

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access your tasks",
        fallbackLabel: "Use Password",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      });

      console.log("🔐 Biometric result:", result);

      if (result.success) {
        const mockToken = "biometric-jwt-token-" + Date.now();
        login({ jwtToken: mockToken });

        Toast.show({
          type: "success",
          text1: "Biometric Login Successful! 🎉",
          text2: "Welcome back!",
          visibilityTime: 2000,
        });

        router.replace("/(logged-in)/home");
      } else {
        if (result.error === "user_cancel") {
          Toast.show({
            type: "info",
            text1: "Authentication Cancelled",
            text2: "You can try again anytime",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Authentication Failed",
            text2: "Please try again or use password",
          });
        }
      }
    } catch (error) {
      console.error("🔐 Biometric authentication error:", error);
      Toast.show({
        type: "error",
        text1: "Biometric Error",
        text2: "Please try again or use password",
      });
    }
  }, [login, router]);

  useEffect(() => {
    checkBiometricSupport();
  }, [checkBiometricSupport]);

  useEffect(() => {
    if (creds?.jwtToken) {
      router.replace("/(logged-in)/home");
    }
  }, [creds, router]);

  return {
    control,
    errors,
    authState,
    handleLogin: handleSubmit(handleLogin),
    handleBiometricLogin,
    setValue,
  };
};

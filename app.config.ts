export default {
  expo: {
    name: "hazemAssesment",
    slug: "hazemAssesment",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "hazemAssesment",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.company.hazemAssesment",
      infoPlist: {
        NSFaceIDUsageDescription: "This app uses Face ID for secure authentication to access your tasks.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.company.hazemAssesment",
      permissions: ["USE_BIOMETRIC", "USE_FINGERPRINT"],
    },
    extra: {
      eas: {
        projectId: "852d9ace-fa15-40ed-bcdf-2cc44b392361",
      },
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      apiTimeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "10000"),
    },
    plugins: [
      "expo-secure-store",
      "expo-local-authentication",
      "expo-router",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};

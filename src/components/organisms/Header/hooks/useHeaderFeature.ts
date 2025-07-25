import { useAuthStore, useThemeStore } from "@store";
import { useCallback, useState } from "react";

import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { taskApi } from "@api/taskApi";
import { useRouter } from "expo-router";

// header feature hook - handles header-specific logic
export const useHeaderFeature = () => {
  const [showDebugOptions, setShowDebugOptions] = useState(false);
  const { logout } = useAuthStore();
  const { toggleTheme, mode } = useThemeStore();
  const router = useRouter();

  // toggle debug panel
  const handleToggleDebugOptions = useCallback(() => {
    setShowDebugOptions((prev) => !prev);
  }, []);

  // execute dataset switch
  const executeDatasetSwitch = useCallback(async (type: "small" | "large" | "stress", onRefresh: () => void) => {
    try {
      switch (type) {
        case "small":
          await taskApi.resetToSmallDataset();
          break;
        case "large":
          await taskApi.loadLargeDataset();
          break;
        case "stress":
          await taskApi.generateStressTestData(500);
          break;
        default:
          throw new Error(`unknown dataset type: ${type}`);
      }

      await onRefresh();

      const info = taskApi.getDatasetInfo();
      Alert.alert("Dataset Loaded ✅", `Mode: ${info.mode.toUpperCase()}\nTasks: ${info.count}`);
    } catch (err) {
      console.error("dataset switch failed:", err);
      Alert.alert("Error", "Failed to switch dataset");
    }
  }, []);

  // dataset testing for performance
  const handleDatasetTest = useCallback(
    async (type: "small" | "large" | "stress", onRefresh: () => void) => {
      try {
        if (type !== "small") {
          const taskCount = type === "large" ? "150" : "650+";
          Alert.alert(
            "⚠️ Performance Testing",
            `This will load ${taskCount} test tasks.\n\n⚠️ Your current tasks will be replaced!\n\nUse "Small (3)" to return to normal mode.`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: `Load ${taskCount} Tasks`,
                style: "destructive",
                onPress: () => executeDatasetSwitch(type, onRefresh),
              },
            ]
          );
          return;
        }

        await executeDatasetSwitch(type, onRefresh);
      } catch (err) {
        console.error("dataset test failed:", err);
        Alert.alert("Error", "Failed to load test dataset");
      }
    },
    [executeDatasetSwitch]
  );

  // logout with confirmation
  const handleLogout = useCallback(() => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          Toast.show({
            type: "info",
            text1: "Signing Out...",
            visibilityTime: 1500,
          });

          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }, [logout, router]);

  return {
    showDebugOptions,
    mode,
    toggleTheme,
    handleToggleDebugOptions,
    handleDatasetTest,
    handleLogout,
  };
};

import { Alert, Text, View } from "react-native";
import React, { useState } from "react";

import { AddTaskModal } from "@components/molecules";
import { Button } from "@components/atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskList } from "@components/organisms/TaskList";
import { taskApi } from "@api/taskApi";
import { useHomeScreenStyles } from "./styles";
import { useTasksFeature } from "./hooks/useTasks";
import { useThemeStore } from "@store/themeStore";

export default function HomeScreen() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [showDebugOptions, setShowDebugOptions] = useState(false);
  const { mode } = useThemeStore();
  const styles = useHomeScreenStyles();

  const {
    screenState,
    taskStore,
    taskStats,
    handlers: {
      handleRefresh,
      handleAddTask,
      handleToggleComplete,
      handleDeleteTask,
      handleLogout,
      handleScrollToEndComplete,
    },
  } = useTasksFeature();

  const { toggleTheme } = useThemeStore();

  const handleDatasetTest = async (type: "small" | "large" | "stress") => {
    try {
      if (type !== "small") {
        // Warn user about data loss for performance testing
        Alert.alert(
          "⚠️ Performance Testing",
          `This will load ${type === "large" ? "150" : "650+"} test tasks for performance evaluation.\n\n⚠️ Your current tasks will be replaced!\n\nUse "Small (3)" to return to normal mode.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: `Load ${type === "large" ? "150" : "650+"} Tasks`,
              style: "destructive",
              onPress: () => executeDatasetSwitch(type),
            },
          ]
        );
        return;
      }

      await executeDatasetSwitch(type);
    } catch (err) {
      console.error("Dataset test failed:", err);
      Alert.alert("Error", "Failed to load test dataset");
    }
  };

  const executeDatasetSwitch = async (type: "small" | "large" | "stress") => {
    try {
      if (type === "small") {
        await taskApi.resetToSmallDataset();
      } else if (type === "large") {
        await taskApi.loadLargeDataset();
      } else if (type === "stress") {
        await taskApi.generateStressTestData(500);
      }

      // Refresh to get new data
      await handleRefresh();

      const info = taskApi.getDatasetInfo();
      Alert.alert("Dataset Loaded ✅", `Mode: ${info.mode.toUpperCase()}\nTasks: ${info.count}`);
    } catch (err) {
      console.error("Dataset switch failed:", err);
      Alert.alert("Error", "Failed to switch dataset");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {taskStats.completed}/{taskStats.total} completed
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Button
            onPress={toggleTheme}
            variant="ghost"
            size="medium"
            icon={mode === "light" ? "moon-outline" : "sunny-outline"}
            iconOnly
          />

          <Button onPress={() => setIsAddModalVisible(true)} variant="ghost" size="medium" icon="add" iconOnly />

          <Button
            onPress={() => setShowDebugOptions(!showDebugOptions)}
            variant="ghost"
            size="medium"
            icon="settings-outline"
            iconOnly
          />

          <Button onPress={handleLogout} variant="ghost" size="medium" icon="log-out-outline" iconOnly />
        </View>
      </View>

      {/* Performance Testing Panel */}
      {showDebugOptions && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>Performance Testing</Text>
          <View style={styles.debugButtons}>
            <Button title="Small (3)" onPress={() => handleDatasetTest("small")} variant="outline" size="small" />
            <Button title="Large (150)" onPress={() => handleDatasetTest("large")} variant="outline" size="small" />
            <Button title="Stress (650)" onPress={() => handleDatasetTest("stress")} variant="outline" size="small" />
          </View>
        </View>
      )}

      <View style={styles.contentContainer}>
        {taskStore.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{taskStore.error}</Text>
          </View>
        )}

        <TaskList
          tasks={taskStore.tasks}
          loading={taskStore.loading}
          refreshing={false}
          onRefresh={handleRefresh}
          onTaskComplete={handleToggleComplete}
          onTaskDelete={handleDeleteTask}
          shouldScrollToEnd={screenState.shouldScrollToEnd}
          onScrollToEndComplete={handleScrollToEndComplete}
        />
      </View>

      <AddTaskModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddTask={handleAddTask}
        loading={screenState.addingTask}
      />
    </SafeAreaView>
  );
}

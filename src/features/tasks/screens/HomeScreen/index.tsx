import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { taskApi } from "@api/taskApi";
import { Button } from "@components/atoms";
import { AddTaskModal } from "@components/molecules";
import { TaskList } from "@components/organisms/TaskList";
import { useThemeStore } from "@store/themeStore";
import { useTasksFeature } from "./hooks/useTasks";
import { useHomeScreenStyles } from "./styles";

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
      Alert.alert("Dataset Test", `Loading ${type} dataset...`, [{ text: "OK" }]);

      if (type === "small") {
        await taskApi.resetToSmallDataset();
      } else if (type === "large") {
        // Already has 150 tasks by default
      } else if (type === "stress") {
        await taskApi.generateStressTestData(500);
      }

      // Refresh the list
      await handleRefresh();

      Alert.alert(
        "Dataset Loaded",
        `${type === "small" ? "3" : type === "large" ? "150" : "650"} tasks loaded for performance testing`
      );
    } catch (err) {
      console.error("Dataset test failed:", err);
      Alert.alert("Error", "Failed to load test dataset");
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

      {/* Debug Options Panel */}
      {showDebugOptions && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>Performance Testing</Text>

          {/* Dataset Controls */}
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

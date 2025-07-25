import { Header, TaskList } from "@components/organisms";
import React, { useState } from "react";
import { Text, View } from "react-native";

import { AddTaskModal } from "@components/molecules";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHomeScreenStyles } from "./styles";
import { useTasksFeature } from "./hooks/useTasks";

// simplified home screen - uses mutation states directly
export default function HomeScreen() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const styles = useHomeScreenStyles();

  const {
    screenState,
    taskStore,
    taskStats,
    mutationStates,
    handlers: { handleRefresh, handleAddTask, handleToggleComplete, handleDeleteTask, handleScrollToEndComplete },
  } = useTasksFeature();

  // open add task modal
  const handleOpenAddModal = () => {
    setIsAddModalVisible(true);
  };

  // close modal and add task
  const handleAddTaskAndClose = async (taskData: { title: string; description?: string; completed?: boolean }) => {
    await handleAddTask(taskData);
    setIsAddModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header with title, stats, and actions */}
      <Header taskStats={taskStats} onAddTask={handleOpenAddModal} onRefresh={handleRefresh} />

      {/* main content */}
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

      {/* add task modal - uses mutation loading state directly */}
      <AddTaskModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddTask={handleAddTaskAndClose}
        loading={mutationStates.addingTask} // direct mutation state
      />
    </SafeAreaView>
  );
}

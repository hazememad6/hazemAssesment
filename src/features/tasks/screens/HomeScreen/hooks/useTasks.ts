import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { useAuthStore, useThemeStore } from "@store";
import { useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from "../../../hooks/useTaskMutations";
import { useTasksQuery, useTaskStatsQuery } from "../../../hooks/useTaskQueries";

interface TaskScreenState {
  addingTask: boolean;
}

export const useTasksFeature = () => {
  const [screenState, setScreenState] = useState<TaskScreenState>({
    addingTask: false,
  });

  const { logout } = useAuthStore();
  const { theme, toggleTheme, mode } = useThemeStore();
  const router = useRouter();

  // Simple React Query hooks
  const { data: tasks = [], isLoading, error, refetch } = useTasksQuery();
  const addTaskMutation = useAddTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const taskStats = useTaskStatsQuery(tasks);

  // Simple refresh handler
  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Instant add task handler
  const handleAddTask = useCallback(
    async (taskData: { title: string; description?: string; completed?: boolean }) => {
      if (screenState.addingTask) return;

      setScreenState((prev) => ({ ...prev, addingTask: true }));

      try {
        // Mutation handles instant feedback and optimistic updates
        await addTaskMutation.mutateAsync(taskData);
      } catch (error) {
        // Error handling is done in mutation
        console.error("Add task error:", error);
      } finally {
        setScreenState((prev) => ({ ...prev, addingTask: false }));
      }
    },
    [addTaskMutation, screenState.addingTask]
  );

  // Instant toggle complete handler
  const handleToggleComplete = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      try {
        // Mutation handles instant feedback and optimistic updates
        await updateTaskMutation.mutateAsync({
          id,
          updates: { completed: !task.completed },
        });
      } catch (error) {
        // Error handling is done in mutation
        console.error("Update task error:", error);
      }
    },
    [updateTaskMutation, tasks]
  );

  // Instant delete handler
  const handleDeleteTask = useCallback(
    async (id: string) => {
      Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Mutation handles instant feedback and optimistic updates
              await deleteTaskMutation.mutateAsync(id);
            } catch (error) {
              // Error handling is done in mutation
              console.error("Delete task error:", error);
            }
          },
        },
      ]);
    },
    [deleteTaskMutation]
  );

  // Simple logout handler
  const handleLogout = useCallback(() => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          // Show feedback
          Toast.show({
            type: "info",
            text1: "Signing Out...",
            visibilityTime: 1500,
          });

          // Simple logout
          logout();

          // Navigate immediately
          router.replace("/(auth)/login");
        },
      },
    ]);
  }, [logout, router]);

  return {
    screenState,
    taskStore: {
      tasks,
      loading: isLoading,
      error: error?.message || null,
    },
    theme: { theme, toggleTheme, mode },
    taskStats,
    handlers: {
      handleRefresh,
      handleAddTask,
      handleToggleComplete,
      handleDeleteTask,
      handleLogout,
    },
  };
};

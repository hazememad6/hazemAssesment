import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@query/queryKeys";
import { Task } from "src/types/task";
import Toast from "react-native-toast-message";
import { taskApi } from "@api/taskApi";

// Simple add task mutation - always succeeds locally
export const useAddTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: { title: string; description?: string; completed?: boolean }) =>
      taskApi.createTask({
        title: taskData.title,
        description: taskData.description || "",
        completed: taskData.completed || false,
      }),
    onMutate: async (taskData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks.all);

      // Create optimistic task with unique ID
      const optimisticTask: Task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: taskData.title,
        description: taskData.description || "",
        completed: taskData.completed || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically update cache
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) => [...old, optimisticTask]);

      // Show instant feedback
      Toast.show({
        type: "success",
        text1: "Task Added! ✅",
        text2: taskData.title,
        visibilityTime: 2000,
      });

      return { previousTasks, optimisticTask };
    },
    onSuccess: (newTask, variables, context) => {
      // Replace optimistic task with real task from server
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) =>
        old.map((task) => (task.id === context?.optimisticTask.id ? newTask : task))
      );
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
      }

      Toast.show({
        type: "error",
        text1: "Failed to add task",
        text2: "Please try again",
      });
    },
  });
};

// Simple update task mutation - always succeeds locally
export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => taskApi.updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks.all);

      // Optimistically update
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) =>
        old.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task))
      );

      // Show instant feedback
      if (updates.completed !== undefined) {
        Toast.show({
          type: "success",
          text1: updates.completed ? "Task Completed! 🎉" : "Task Reopened",
          visibilityTime: 1500,
        });
      }

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      // Handle task not found gracefully (normal for optimistic updates)
      if (error.message === "Task not found") {
        // Remove the orphaned task from cache
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) =>
          old.filter((task) => task.id !== variables.id)
        );

        Toast.show({
          type: "info",
          text1: "Task was removed",
          text2: "This task wasn't saved before the app was closed",
          visibilityTime: 3000,
        });
      } else {
        // Rollback on other errors
        if (context?.previousTasks) {
          queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
        }

        Toast.show({
          type: "error",
          text1: "Update failed",
          text2: "Please try again",
        });
      }
    },
  });
};

// Simple delete task mutation - always succeeds locally
export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks.all);

      // Optimistically remove task
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) => old.filter((task) => task.id !== id));

      // Show instant feedback
      Toast.show({
        type: "success",
        text1: "Task Deleted ✅",
        visibilityTime: 1500,
      });

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      // Handle task not found gracefully (normal for optimistic updates)
      if (error.message === "Task not found") {
        // Task was already removed (either by cache validation or it never existed)
        Toast.show({
          type: "info",
          text1: "Task already removed",
          text2: "This task wasn't saved before the app was closed",
          visibilityTime: 2000,
        });
      } else {
        // Rollback on other errors
        if (context?.previousTasks) {
          queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
        }

        Toast.show({
          type: "error",
          text1: "Delete failed",
          text2: "Please try again",
        });
      }
    },
  });
};

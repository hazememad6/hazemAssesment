import Toast from "react-native-toast-message";
import { taskApi } from "@api/taskApi";
import { QUERY_KEYS } from "@query/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "src/types/task";

// Simple add task mutation with optimistic update
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
      // Show instant success toast
      Toast.show({
        type: "success",
        text1: "Task Added!",
        text2: taskData.title,
        visibilityTime: 2000,
      });

      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks.all);

      // Optimistically update to new value
      const optimisticTask: Task = {
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: taskData.title,
        description: taskData.description || "",
        completed: taskData.completed || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) => [...old, optimisticTask]);

      return { previousTasks, optimisticTask };
    },
    onSuccess: (newTask, variables, context) => {
      // Replace optimistic task with real task
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) =>
        old.map((task) => (task.id === context?.optimisticTask.id ? newTask : task))
      );
    },
    onError: (error, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(QUERY_KEYS.tasks.all, context?.previousTasks);
      Toast.show({
        type: "error",
        text1: "Failed to add task",
        text2: "Please try again",
      });
    },
  });
};

// Simple update task mutation with better error handling
export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      // Skip temporary tasks (they don't exist on server yet)
      if (id.startsWith("temp_")) {
        throw new Error("Cannot update temporary task");
      }
      return taskApi.updateTask(id, updates);
    },
    onMutate: async ({ id, updates }) => {
      // Skip optimistic update for temporary tasks
      if (id.startsWith("temp_")) {
        Toast.show({
          type: "error",
          text1: "Please wait",
          text2: "Task is still being saved...",
        });
        return;
      }

      // Show instant feedback
      if (updates.completed !== undefined) {
        Toast.show({
          type: "success",
          text1: updates.completed ? "Task Completed! 🎉" : "Task Reopened",
          visibilityTime: 1500,
        });
      }

      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });

      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks.all);

      // Optimistically update
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) =>
        old.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task))
      );

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
      }

      // Refresh data from server to sync
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all });

      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: "Refreshing data...",
      });
    },
  });
};

// Simple delete task mutation with better error handling
export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Skip temporary tasks (they don't exist on server yet)
      if (id.startsWith("temp_")) {
        throw new Error("Cannot delete temporary task");
      }
      return taskApi.deleteTask(id);
    },
    onMutate: async (id) => {
      // Skip optimistic update for temporary tasks
      if (id.startsWith("temp_")) {
        Toast.show({
          type: "error",
          text1: "Please wait",
          text2: "Task is still being saved...",
        });
        return;
      }

      // Show instant feedback
      Toast.show({
        type: "success",
        text1: "Task Deleted",
        visibilityTime: 1500,
      });

      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });

      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks.all);

      // Optimistically remove task
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) => old.filter((task) => task.id !== id));

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
      }

      // Refresh data from server to sync
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all });

      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: "Refreshing data...",
      });
    },
  });
};

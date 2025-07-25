import { useAddTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } from "../../../hooks/useTaskMutations";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTaskStatsQuery, useTasksQuery } from "../../../hooks/useTaskQueries";

import { Alert } from "react-native";
import { validateCacheWithServer } from "@providers/reactQueryProvider";

interface TaskScreenState {
  shouldScrollToEnd: boolean; // just for auto scroll feature
}

// main task feature hook - simplified after refactoring
// used to be a huge mess with manual loading states everywhere
// now just uses react query mutation states directly - much cleaner
export const useTasksFeature = () => {
  const [screenState, setScreenState] = useState<TaskScreenState>({
    shouldScrollToEnd: false,
  });

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // react query hooks for data and mutations
  const { data: tasks = [], isLoading, error, refetch } = useTasksQuery();
  const addTaskMutation = useAddTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const taskStats = useTaskStatsQuery(tasks);

  // cleanup timeout on unmount (learned this prevents memory leaks)
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, []);

  // auto scroll when task is added successfully
  // this took way too much debugging to get right
  useEffect(() => {
    if (addTaskMutation.isSuccess) {
      // clear any existing timeout first
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // small delay to ensure optimistic update renders before scroll
      scrollTimeoutRef.current = setTimeout(() => {
        setScreenState((prev) => ({
          ...prev,
          shouldScrollToEnd: true,
        }));
        console.log("[useTasks] auto-scroll triggered"); // helpful for debugging
        scrollTimeoutRef.current = null;
      }, 100); // 100ms seems to be the sweet spot
    }
  }, [addTaskMutation.isSuccess]);

  const handleRefresh = useCallback(async () => {
    // validate cache first to clean up orphaned tasks, then refresh
    await validateCacheWithServer();
    await refetch();
  }, [refetch]);

  const handleScrollToEndComplete = useCallback(() => {
    setScreenState((prev) => ({ ...prev, shouldScrollToEnd: false }));
  }, []);

  // add task - mutation handles all the state magic
  const handleAddTask = useCallback(
    (taskData: { title: string; description?: string; completed?: boolean }) => {
      if (addTaskMutation.isPending) return; // prevent double submissions

      addTaskMutation.mutate(taskData); // switched from mutateAsync to prevent hanging
    },
    [addTaskMutation]
  );

  // toggle completion - this was causing the hanging issue before
  // switched to mutate() instead of mutateAsync() and it's much more stable
  const handleToggleComplete = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) {
        console.warn("[useTasks] Task not found for toggle:", id);
        return;
      }

      if (updateTaskMutation.isPending) {
        console.log("[useTasks] Update already pending, skipping toggle");
        return; // prevent multiple toggles
      }

      const newCompletedState = !task.completed;
      console.log(`[useTasks] Toggling task ${id} from ${task.completed} to ${newCompletedState}`);

      // using mutate instead of mutateAsync to prevent promise hanging
      // this was the key fix for the toggle issue
      updateTaskMutation.mutate({
        id,
        updates: { completed: newCompletedState },
      });
    },
    [updateTaskMutation, tasks]
  );

  // delete with confirmation dialog
  const handleDeleteTask = useCallback(
    (id: string) => {
      if (deleteTaskMutation.isPending) return; // prevent multiple deletes

      Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTaskMutation.mutate(id); // also using mutate here for consistency
          },
        },
      ]);
    },
    [deleteTaskMutation]
  );

  return {
    screenState,
    taskStore: {
      tasks,
      loading: isLoading,
      error: error?.message || null,
    },
    taskStats,
    mutationStates: {
      // expose all mutation states for components
      // this is much cleaner than managing loading states manually
      addingTask: addTaskMutation.isPending,
      addTaskSuccess: addTaskMutation.isSuccess,
      addTaskError: addTaskMutation.error,

      updatingTask: updateTaskMutation.isPending,
      updateTaskSuccess: updateTaskMutation.isSuccess,
      updateTaskError: updateTaskMutation.error,

      deletingTask: deleteTaskMutation.isPending,
      deleteTaskSuccess: deleteTaskMutation.isSuccess,
      deleteTaskError: deleteTaskMutation.error,
    },
    handlers: {
      handleRefresh,
      handleAddTask,
      handleToggleComplete,
      handleDeleteTask,
      handleScrollToEndComplete,
    },
  };
};

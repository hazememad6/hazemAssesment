import { MUTATION_KEYS, QUERY_KEYS } from "@query/queryKeys";

import { Task } from "src/types/task";
import Toast from "react-native-toast-message";
import { taskApi } from "@api/taskApi";
import { useApiMutation } from "@query/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Task Mutations Hook
 *
 * OK so this went through like 5 different iterations lol
 * First I was doing everything manually with useState
 * Then I discovered react-query and was like "holy shit this is amazing"
 * But then optimistic updates were breaking everything
 * Spent way too much time debugging why tasks would disappear after app restart
 *
 * Current approach: UI first, server second
 * - User does something → UI updates instantly → server call in background
 * - Server fails → rollback (axios shows error automatically)
 * - Server succeeds → replace optimistic data with real data
 *
 * This gives that snappy native app feel but keeps data consistent
 *
 * NOTE: axios interceptor handles error toasts globally now, so we only do
 * rollbacks and specific business stuff in onError
 */

// Add task - this one is crucial for user engagement
export const useAddTaskMutation = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    MUTATION_KEYS.tasks.add,
    (taskData: { title: string; description?: string; completed?: boolean }) =>
      taskApi.createTask({
        title: taskData.title,
        description: taskData.description || "", // empty string fallback feels better than undefined
        completed: taskData.completed || false,
      }),
    {
      invalidate: [QUERY_KEYS.tasks.all], // auto invalidate - love this feature
      onMutate: async (taskData) => {
        // step 1: stop any ongoing fetches (learned this the hard way)
        await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });

        // step 2: backup current state for rollback
        const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks.all);

        // step 3: create fake task for instant feedback
        // using timestamp + random for unique id until server responds
        const optimisticTask: Task = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // this id strategy works well enough
          title: taskData.title,
          description: taskData.description || "",
          completed: taskData.completed || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // step 4: add to list optimistically
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) => [...old, optimisticTask]);

        // step 5: show success toast immediately (users love instant feedback)
        Toast.show({
          type: "success",
          text1: "Task Added! ✅",
          text2: taskData.title,
          visibilityTime: 2000,
        });

        return { previousTasks, optimisticTask };
      },
      onSuccess: (newTask, variables, context) => {
        // replace fake task with real one from server
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) =>
          old.map((task) => (task.id === context?.optimisticTask.id ? newTask : task))
        );
      },
      onError: (error, variables, context) => {
        // shit hit the fan - rollback everything
        if (context?.previousTasks) {
          queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
        }
        // axios will show the error toast automatically
      },
    }
  );
};

// Update task - handles toggles and edits
export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    MUTATION_KEYS.tasks.update,
    ({ id, updates }: { id: string; updates: Partial<Task> }) => taskApi.updateTask(id, updates),
    {
      invalidate: [QUERY_KEYS.tasks.all],
      onMutate: async ({ id, updates }) => {
        // same dance as add - cancel, snapshot, update
        await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });
        const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks.all);

        // apply changes optimistically
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) =>
          old.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task))
        );

        // special case for completion toggles - people expect immediate feedback
        if (updates.completed !== undefined) {
          const message = updates.completed ? "Task Completed! 🎉" : "Task Reopened";
          Toast.show({
            type: "success",
            text1: message,
            visibilityTime: 1500, // shorter for toggles
          });
        }

        return { previousTasks };
      },
      onSuccess: (updatedTask, variables) => {
        // replace optimistic with real server data
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) =>
          old.map((task) => (task.id === variables.id ? updatedTask : task))
        );
        console.log(`[Mutation] Update done for ${variables.id}`); // helpful for debugging
      },
      onError: (error, variables, context) => {
        console.log(`[Mutation] Update failed for ${variables.id}:`, error.message);

        // handle the annoying "task not found" case
        // this happens when user tries to update a task that was only optimistic
        if (error.message === "Task not found") {
          // just remove it from cache - it wasn't real anyway
          queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) =>
            old.filter((task) => task.id !== variables.id)
          );

          // explain to user what happened
          Toast.show({
            type: "info",
            text1: "Task was removed",
            text2: "This task wasn't saved before the app was closed",
            visibilityTime: 3000,
          });
        } else {
          // regular error - just rollback
          if (context?.previousTasks) {
            queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
          }
        }
      },
    }
  );
};

// Delete task - immediate removal with rollback
export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useApiMutation(MUTATION_KEYS.tasks.delete, (id: string) => taskApi.deleteTask(id), {
    invalidate: [QUERY_KEYS.tasks.all],
    onMutate: async (id) => {
      console.log(`[Delete Mutation] Starting delete for task ${id}`);

      // Cancel outgoing queries and get snapshot
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks.all);

      // Remove task immediately from UI (optimistic update)
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (old = []) => old.filter((task) => task.id !== id));

      // Show immediate feedback
      Toast.show({
        type: "success",
        text1: "Task Deleted ✅",
        visibilityTime: 1500,
      });

      return { previousTasks };
    },
    onSuccess: (data, variables) => {
      console.log(`[Delete Mutation] Success for task ${variables}`);
      // Task already removed optimistically, just log success
    },
    onError: (error, variables, context) => {
      console.log(`[Delete Mutation] Error for task ${variables}:`, error.message);

      // Rollback optimistic update
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
      }

      // Show error feedback
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: error.message,
        visibilityTime: 3000,
      });
    },
    onSettled: (data, error, variables) => {
      console.log(`[Delete Mutation] Settled for task ${variables} - mutation complete`);
      // Ensure queries are invalidated to refresh data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all });
    },
  });
};

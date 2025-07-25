import { QUERY_KEYS } from "@query/queryKeys";
import { Task } from "src/types/task";
import { taskApi } from "@api/taskApi";
import { useQuery } from "@tanstack/react-query";

// Simple tasks query - cache first, manual refresh only
export const useTasksQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tasks.all,
    queryFn: () => taskApi.getTasks(),
    staleTime: Infinity, // Data is always fresh from cache
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on focus
    refetchOnReconnect: false, // Don't refetch when coming back online
  });
};

// Simple task stats
export const useTaskStatsQuery = (tasks: Task[]) => {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.filter((task) => !task.completed).length;
  const total = tasks.length;

  return {
    completed,
    pending,
    total,
  };
};

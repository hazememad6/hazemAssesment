import { QUERY_KEYS } from "@query/queryKeys";
import { Task } from "src/types/task";
import { taskApi } from "@api/taskApi";
import { useApiQuery } from "@query/useApiQuery";

// tasks query - cache first approach
// took me forever to get this config right lol
export const useTasksQuery = () => {
  return useApiQuery(QUERY_KEYS.tasks.all, () => taskApi.getTasks(), {
    staleTime: Infinity, // never auto-refresh from cache (learned this prevents weird flickering)
    refetchOnMount: false, // don't auto refresh when component mounts
    refetchOnWindowFocus: false, // don't refresh when user comes back to app
    refetchOnReconnect: false, // don't auto refresh on network reconnect
    // basically: manual refresh only, cache everything else
  });
};

// quick stats calculation
// TODO: maybe memoize this if performance becomes an issue
// for now it's fast enough and keeps code simple
export const useTaskStatsQuery = (tasks: Task[]) => {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.filter((task) => !task.completed).length;
  const total = tasks.length;

  // returning object instead of array for better readability
  return {
    completed,
    pending,
    total,
  };
};

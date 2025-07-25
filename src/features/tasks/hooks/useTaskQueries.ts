import { taskApi } from "@api/taskApi";
import { QUERY_KEYS } from "@query/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { Task } from "src/types/task";

// Simple tasks query
export const useTasksQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tasks.all,
    queryFn: () => taskApi.getTasks(),
    staleTime: 1000 * 60 * 5, // 5 minutes
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

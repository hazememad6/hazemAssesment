import { Task } from "src/types/task";

export interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskComplete: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

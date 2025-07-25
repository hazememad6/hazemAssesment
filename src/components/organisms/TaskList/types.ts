import { Task } from "src/types/task";

export interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onTaskComplete: (id: string) => void;
  onTaskDelete: (id: string) => void;
  shouldScrollToEnd?: boolean; // New prop for auto-scroll
  onScrollToEndComplete?: () => void; // Callback when scroll completes
}

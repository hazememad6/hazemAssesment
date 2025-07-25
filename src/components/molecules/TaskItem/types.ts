import { Task } from "src/types/task";

export interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean; // loading state for toggle
  isDeleting?: boolean; // loading state for delete
}

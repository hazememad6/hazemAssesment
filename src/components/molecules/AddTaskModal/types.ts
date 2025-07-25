import { Task } from "src/types/task";

export interface AddTaskFormData {
  title: string;
  description?: string;
}

export interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  loading?: boolean;
}

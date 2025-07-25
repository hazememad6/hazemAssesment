export interface AddTaskFormProps {
  onSubmit: (task: { title: string; description?: string; completed: boolean }) => void;
  loading?: boolean;
}

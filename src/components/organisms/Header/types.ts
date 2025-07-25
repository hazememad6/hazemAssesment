export interface HeaderProps {
  taskStats: {
    completed: number;
    total: number;
  };
  onAddTask: () => void;
  onRefresh: () => void;
}

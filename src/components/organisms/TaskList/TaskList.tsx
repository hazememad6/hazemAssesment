import React, { useCallback } from "react";
import { TaskItem } from "@components/molecules";
import { Task } from "src/types/task";
import { GenericFlashList } from "../../atoms/GenericFlashList/GenericFlashList";
import { TaskListProps } from "./types";

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  refreshing = false,
  onRefresh,
  onTaskComplete,
  onTaskDelete,
}) => {
  // Memoize the render function to prevent unnecessary re-renders
  const renderTaskItem = useCallback(
    ({ item }: { item: Task }) => <TaskItem task={item} onComplete={onTaskComplete} onDelete={onTaskDelete} />,
    [onTaskComplete, onTaskDelete]
  );

  // Optimize keyExtractor
  const keyExtractor = useCallback((item: Task) => item.id, []);

  return (
    <GenericFlashList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={keyExtractor}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      emptyText="No tasks yet. Add your first task!"
      estimatedItemSize={120}
      // FlashList specific optimizations
      drawDistance={250}
    />
  );
};

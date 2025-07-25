import React, { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { TaskItem } from "@components/molecules";
import { FlashList } from "@shopify/flash-list";
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
  shouldScrollToEnd = false,
  onScrollToEndComplete,
}) => {
  const flashListRef = useRef<FlashList<Task>>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simplified auto-scroll implementation
  useEffect(() => {
    if (shouldScrollToEnd && tasks.length > 0 && flashListRef.current) {
      console.log(`[AutoScroll] Triggering scroll - Tasks: ${tasks.length}`);

      // Use a consistent approach for both platforms
      const scrollTimeout = setTimeout(() => {
        try {
          if (flashListRef.current) {
            if (Platform.OS === "android") {
              // Android: Use scrollToIndex (working well)
              const lastIndex = tasks.length - 1;
              flashListRef.current.scrollToIndex({
                index: lastIndex,
                animated: true,
                viewPosition: 0,
              });
              console.log("[Android] scrollToIndex executed");
            } else {
              // iOS: Use scrollToEnd (more reliable for FlashList on iOS)
              flashListRef.current.scrollToEnd({
                animated: true,
              });
              console.log("[iOS] scrollToEnd executed");
            }
          }
        } catch (error) {
          console.warn("[AutoScroll] Failed:", error);
        }

        // Call completion callback with proper cleanup
        if (onScrollToEndComplete) {
          completionTimeoutRef.current = setTimeout(onScrollToEndComplete, 400);
        }
      }, 100);

      return () => {
        clearTimeout(scrollTimeout);
        if (completionTimeoutRef.current) {
          clearTimeout(completionTimeoutRef.current);
          completionTimeoutRef.current = null;
        }
      };
    }
  }, [shouldScrollToEnd, tasks.length, onScrollToEndComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
    };
  }, []);

  // Memoize the render function to prevent unnecessary re-renders
  const renderTaskItem = useCallback(
    ({ item }: { item: Task }) => <TaskItem task={item} onComplete={onTaskComplete} onDelete={onTaskDelete} />,
    [onTaskComplete, onTaskDelete]
  );

  // Optimize keyExtractor
  const keyExtractor = useCallback((item: Task) => item.id, []);

  return (
    <GenericFlashList
      ref={flashListRef}
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={keyExtractor}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      emptyText="No tasks yet. Add your first task!"
      estimatedItemSize={120}
      drawDistance={250}
      // Consistent item sizing for better scroll positioning
      overrideItemLayout={(layout, _item, _index) => {
        layout.size = 120;
      }}
    />
  );
};

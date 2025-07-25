import React, { useCallback, useEffect, useRef } from "react";

import { FlashList } from "@shopify/flash-list";
import { GenericFlashList } from "../../atoms/GenericFlashList/GenericFlashList";
import { Platform } from "react-native";
import { Task } from "src/types/task";
import { TaskItem } from "@components/molecules";
import { TaskListProps } from "./types";

// main task list - uses flashlist for performance
// auto scroll is kinda hacky but works
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

  // auto scroll when new task added
  useEffect(() => {
    if (shouldScrollToEnd && tasks.length > 0 && flashListRef.current) {
      console.log(`[AutoScroll] scrolling to ${tasks.length} tasks`);

      const scrollTimeout = setTimeout(() => {
        try {
          if (flashListRef.current) {
            if (Platform.OS === "android") {
              // android likes scrollToIndex better
              const lastIndex = tasks.length - 1;
              flashListRef.current.scrollToIndex({
                index: lastIndex,
                animated: true,
                viewPosition: 0,
              });
            } else {
              // ios prefers scrollToEnd
              flashListRef.current.scrollToEnd({ animated: true });
            }
          }
        } catch (error) {
          console.warn("scroll failed:", error);
        }

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

  // cleanup timeouts
  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
    };
  }, []);

  const renderTaskItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem
        task={item}
        onComplete={onTaskComplete}
        onDelete={onTaskDelete}
        // Remove isUpdating and isDeleting props - let TaskItem handle its own loading states
      />
    ),
    [onTaskComplete, onTaskDelete]
  );

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
      overrideItemLayout={(layout, _item, _index) => {
        layout.size = 120; // consistent sizing for smooth scroll
      }}
    />
  );
};

import { Animated, Switch, Text, View } from "react-native";
import React, { memo, useEffect, useRef } from "react";

import { Button } from "@components/atoms";
import { TaskItemProps } from "./types";
import { useTaskItemStyles } from "./styles";

/**
 * TaskItem Component
 *
 * Displays individual task with toggle and delete actions.
 * Using Switch instead of checkbox because it feels more native on mobile.
 *
 * Simplified animations to prevent conflicts with optimistic updates:
 * - Simple opacity transition for completed state
 * - Removed complex scale animations that were causing freezing
 *
 * Fixed toggle issue - Switch onValueChange passes boolean value that we need to handle properly.
 */
const TaskItem: React.FC<TaskItemProps> = memo(
  ({ task, onComplete, onDelete, isUpdating = false, isDeleting = false }) => {
    const styles = useTaskItemStyles(task);

    // Simplified animation - just opacity for the content
    const contentOpacity = useRef(new Animated.Value(task.completed ? 0.7 : 1)).current;

    // Simple fade animation only - removed complex animations that caused freezing
    useEffect(() => {
      Animated.timing(contentOpacity, {
        toValue: task.completed ? 0.7 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [task.completed, contentOpacity]);

    // Handle completion toggle - receives the new boolean value from Switch
    const handleToggleComplete = (newValue: boolean) => {
      if (isUpdating) return; // prevent toggle during update

      // Only call if the value actually changed to prevent unnecessary calls
      if (newValue !== task.completed) {
        onComplete(task.id);
      }
    };

    const handleDelete = () => {
      if (isDeleting) return; // prevent delete during deletion
      onDelete(task.id);
    };

    return (
      <View style={styles.containerStyle}>
        <View style={styles.rowStyle}>
          <Animated.View style={[styles.contentStyle, { opacity: contentOpacity }]}>
            <Text style={styles.titleStyle} numberOfLines={2}>
              {task.title}
            </Text>
            {task.description && task.description.trim().length > 0 && (
              <Text style={styles.descriptionStyle} numberOfLines={3}>
                {task.description}
              </Text>
            )}
          </Animated.View>

          <View style={styles.actionsStyle}>
            <Switch
              value={task.completed}
              onValueChange={handleToggleComplete}
              disabled={isUpdating} // disable during update
              testID={`task-switch-${task.id}`} // Add testID for tests
              accessibilityLabel={`Mark task ${task.completed ? "incomplete" : "complete"}`}
            />

            <Button
              title="Delete"
              onPress={handleDelete}
              variant="outline"
              size="small"
              disabled={isDeleting} // disable during deletion
              loading={isDeleting} // show loading spinner
              testID={`delete-task-${task.id}`} // Add testID for tests
            />
          </View>
        </View>
      </View>
    );
  }
);

TaskItem.displayName = "TaskItem";

export { TaskItem };

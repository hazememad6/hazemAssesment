import * as Haptics from "expo-haptics";

import { Animated, Switch, Text, View } from "react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@components/atoms";
import { TaskItemProps } from "./types";
import { useTaskItemStyles } from "./styles";
import { useThemeStore } from "@store/themeStore";

/**
 * TaskItem Component
 *
 * Displays individual task with toggle and delete actions.
 * Using Switch instead of checkbox because it feels more native on mobile.
 *
 * Optimized animations for smooth toggle:
 * - Faster 150ms duration for snappy feel
 * - Immediate visual feedback before API call
 * - Native driver for 60fps animations
 * - Haptic feedback for better UX
 *
 * Performance improvements:
 * - useCallback for handlers to prevent re-renders
 * - Optimistic local state for instant feedback
 * - Switch styling for better native feel
 */
const TaskItem: React.FC<TaskItemProps> = memo(({ task, onComplete, onDelete }) => {
  const styles = useTaskItemStyles(task);
  const { theme } = useThemeStore();

  // Local state for immediate feedback - syncs with prop changes
  const [localCompleted, setLocalCompleted] = useState(task.completed);

  // Fast animation for snappy feel - 150ms is the sweet spot
  const contentOpacity = useRef(new Animated.Value(task.completed ? 0.7 : 1)).current;

  // Sync local state when prop changes (from server/cache updates)
  useEffect(() => {
    setLocalCompleted(task.completed);
  }, [task.completed]);

  // Fast, smooth animation with native driver for 60fps
  useEffect(() => {
    Animated.timing(contentOpacity, {
      toValue: localCompleted ? 0.7 : 1,
      duration: 150, // faster for more responsive feel
      useNativeDriver: true,
    }).start();
  }, [localCompleted, contentOpacity]);

  // Optimized toggle handler with immediate feedback + haptics
  const handleToggleComplete = useCallback(
    (newValue: boolean) => {
      // Immediate visual feedback - this is the secret sauce!
      setLocalCompleted(newValue);

      // Light haptic feedback for satisfaction
      Haptics.selectionAsync();

      // Only call parent if value actually changed
      if (newValue !== task.completed) {
        onComplete(task.id);
      }
    },
    [task.completed, task.id, onComplete]
  );

  const handleDelete = useCallback(() => {
    console.log(`[TaskItem] Delete button clicked for task ${task.id}`);
    onDelete(task.id);
  }, [task.id, onDelete]);

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
            value={localCompleted}
            onValueChange={handleToggleComplete}
            testID={`task-switch-${task.id}`}
            accessibilityLabel={`Mark task ${localCompleted ? "incomplete" : "complete"}`}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.success,
            }}
            thumbColor={localCompleted ? theme.colors.card : "#FFFFFF"}
            ios_backgroundColor={theme.colors.border}
          />

          <Button
            title="Delete"
            onPress={handleDelete}
            variant="outline"
            size="small"
            testID={`delete-task-${task.id}`} // Add testID for tests
          />
        </View>
      </View>
    </View>
  );
});

TaskItem.displayName = "TaskItem";

export { TaskItem };

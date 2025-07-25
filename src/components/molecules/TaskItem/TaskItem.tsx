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
 * Added smooth animations for completion state:
 * - Fade effect when completing/uncompleting
 * - Scale bounce animation on completion
 * - Smooth opacity transitions for completed state
 *
 * Fixed toggle issue - Switch onValueChange passes boolean value that we need to handle properly.
 */
const TaskItem: React.FC<TaskItemProps> = memo(
  ({ task, onComplete, onDelete, isUpdating = false, isDeleting = false }) => {
    const styles = useTaskItemStyles(task);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(task.completed ? 0.7 : 1)).current;

    // Animate when completion state changes
    useEffect(() => {
      if (task.completed) {
        // Completion animation: scale bounce + fade
        Animated.sequence([
          // Quick scale up
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
          }),
          // Scale back down with slight overshoot
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 300,
            friction: 10,
            useNativeDriver: true,
          }),
        ]).start();

        // Fade to completed state
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        // Uncomplete animation: just fade back in
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }, [task.completed, scaleAnim, opacityAnim]);

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
      <Animated.View
        style={[
          styles.containerStyle,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.rowStyle}>
          <Animated.View style={[styles.contentStyle, { opacity: opacityAnim }]}>
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
      </Animated.View>
    );
  }
);

TaskItem.displayName = "TaskItem";

export { TaskItem };
